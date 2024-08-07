// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "./interfaces/IOracle.sol";

contract HateSpeechAgent {
    string public prompt;
    string public knowledgeBase;

    struct Message {
        string role;
        string content;
    }

    struct AgentRun {
        address owner;
        Message[] messages;
        uint256 responsesCount;
        uint8 max_iterations;
        bool is_finished;
        uint256 messagesCount;
    }

    mapping(uint256 => AgentRun) public agentRuns;
    uint256 private agentRunCount;

    event AgentRunCreated(address indexed owner, uint256 indexed runId);
    event KnowledgeBaseUpdated(string indexed newKnowledgeBaseCID);

    address private owner;
    address public oracleAddress;

    event OracleAddressUpdated(address indexed newOracleAddress);

    IOracle.OpenAiRequest private config;

    constructor(address initialOracleAddress, string memory systemPrompt) {
        owner = msg.sender;
        oracleAddress = initialOracleAddress;
        prompt = systemPrompt;

        config = IOracle.OpenAiRequest({
            model: "gpt-4-turbo-preview",
            frequencyPenalty: 21, 
            logitBias: "", 
            maxTokens: 1000, 
            presencePenalty: 21,
            responseFormat: '{"type":"text"}',
            seed: 0,
            stop: "", 
            temperature: 10, 
            topP: 101, 
            tools: '[{"type":"function","function":{"name":"web_search","description":"Search the internet","parameters":{"type":"object","properties":{"query":{"type":"string","description":"Search query"}},"required":["query"]}}},{"type":"function","function":{"name":"image_generation","description":"Generates an image using Dalle-2","parameters":{"type":"object","properties":{"prompt":{"type":"string","description":"Dalle-2 prompt to generate an image"}},"required":["prompt"]}}}]',
            toolChoice: "auto", 
            user: "" 
        });
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    modifier onlyOracle() {
        require(msg.sender == oracleAddress, "Caller is not oracle");
        _;
    }

    function setOracleAddress(address newOracleAddress) public onlyOwner {
        require(msg.sender == owner, "Caller is not the owner");
        oracleAddress = newOracleAddress;
        emit OracleAddressUpdated(newOracleAddress);
    }

    function setKnowledgeBaseCid(string memory cid) public onlyOwner {
        require(bytes(cid).length > 0, "CID cannot be empty");
        knowledgeBase = cid;
        emit KnowledgeBaseUpdated(cid);
    }

    function runAgent(
        string memory query,
        uint8 max_iterations
    ) public returns (uint256 i) {
        AgentRun storage run = agentRuns[agentRunCount];

        run.owner = msg.sender;
        run.is_finished = false;
        run.responsesCount = 0;
        run.max_iterations = max_iterations;

        Message memory systemMessage;
        systemMessage.content = prompt;
        systemMessage.role = "system";
        run.messages.push(systemMessage);
        run.messagesCount++;

        Message memory newMessage;
        newMessage.content = query;
        newMessage.role = "user";
        run.messages.push(newMessage);
        run.messagesCount++;

        uint256 currentId = agentRunCount;
        agentRunCount = agentRunCount + 1;

        if (bytes(knowledgeBase).length > 0) {
            IOracle(oracleAddress).createKnowledgeBaseQuery(
                currentId,
                knowledgeBase,
                query,
                2
            );
            emit AgentRunCreated(run.owner, currentId);
        } else {
            IOracle(oracleAddress).createOpenAiLlmCall(currentId, config);
            emit AgentRunCreated(run.owner, currentId);
        }

        return currentId;
    }

    function onOracleOpenAiLlmResponse(
        uint256 runId,
        IOracle.OpenAiResponse memory response,
        string memory errorMessage
    ) public onlyOracle {
        AgentRun storage run = agentRuns[runId];

        if (!compareStrings(errorMessage, "")) {
            Message memory newMessage;
            newMessage.role = "assistant";
            newMessage.content = errorMessage;
            run.messages.push(newMessage);
            run.responsesCount++;
            run.is_finished = true;
            return;
        }

        if (run.responsesCount >= run.max_iterations) {
            run.is_finished = true;
            return;
        }

        if (!compareStrings(response.content, "")) {
            Message memory assistantMessage;
            assistantMessage.content = response.content;
            assistantMessage.role = "assistant";
            run.messages.push(assistantMessage);
            run.responsesCount++;
            run.is_finished = true;
        }

        if (!compareStrings(response.functionName, "")) {
            IOracle(oracleAddress).createFunctionCall(
                runId,
                response.functionName,
                response.functionArguments
            );
            return;
        }

        run.is_finished = true;
    }

    function onOracleKnowledgeBaseQueryResponse(
        uint256 runId,
        string[] memory documents,
        string memory /*errorMessage*/
    ) public onlyOracle {
        AgentRun storage run = agentRuns[runId];
        // Retrieve the last user message
        require(
            keccak256(
                abi.encodePacked(run.messages[run.messagesCount - 1].role)
            ) == keccak256(abi.encodePacked("user")),
            "No message to add context to"
        );
        Message storage lastMessage = run.messages[run.messagesCount - 1];
        // Start with the original message content
        string memory newContent = lastMessage.content;

        // Append "Relevant context:\n" only if there are documents
        if (documents.length > 0) {
            newContent = string(
                abi.encodePacked(newContent, "\n\nRelevant context:\n")
            );
        }

        // Iterate through the documents and append each to the newContent
        for (uint256 i = 0; i < documents.length; i++) {
            newContent = string(
                abi.encodePacked(newContent, documents[i], "\n")
            );
        }

        // Finally, set the lastMessage content to the newly constructed string
        lastMessage.content = newContent;

        // Call LLM
        IOracle(oracleAddress).createOpenAiLlmCall(runId, config);
        emit AgentRunCreated(run.owner, runId);
    }

    function onOracleFunctionResponse(
        uint256 runId,
        string memory response,
        string memory errorMessage
    ) public onlyOracle {
        AgentRun storage run = agentRuns[runId];
        require(!run.is_finished, "Run is finished");
        string memory result = response;
        if (!compareStrings(errorMessage, "")) {
            result = errorMessage;
        }
        Message memory newMessage;
        newMessage.role = "user";
        newMessage.content = result;
        run.messages.push(newMessage);
        run.responsesCount++;
        IOracle(oracleAddress).createOpenAiLlmCall(runId, config);
    }

    function getMessageHistoryContents(
        uint256 agentId
    ) public view returns (string[] memory) {
        string[] memory messages = new string[](
            agentRuns[agentId].messages.length
        );
        for (uint256 i = 0; i < agentRuns[agentId].messages.length; i++) {
            messages[i] = agentRuns[agentId].messages[i].content;
        }
        return messages;
    }

    function getMessageHistoryRoles(
        uint256 agentId
    ) public view returns (string[] memory) {
        string[] memory roles = new string[](
            agentRuns[agentId].messages.length
        );
        for (uint256 i = 0; i < agentRuns[agentId].messages.length; i++) {
            roles[i] = agentRuns[agentId].messages[i].role;
        }
        return roles;
    }

    function isRunFinished(uint256 runId) public view returns (bool) {
        return agentRuns[runId].is_finished;
    }

    function compareStrings(
        string memory a,
        string memory b
    ) private pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }
}
