## Mission Statement

We empower people with lived experience of online abuse to leverage AI and Web 3 tools to actively govern and create safer spaces for all.

## What are we hoping to achieve with this project?

1. Citizen owned and governed AI
2. Web3 tools for democratisation of ownership and governance
3. Incorporating “lived experience” for inclusivity, bias reduction, and for designing resilient systems.

## What does this tool do?

<img width="840" alt="Screenshot 2024-07-01 at 00 51 55" src="https://github.com/TheBarnakhil/hate-speech-reporting/assets/142992581/fcf4a38a-ccad-4be4-b14c-2383bc41c530">
<img width="833" alt="Screenshot 2024-07-01 at 00 50 21" src="https://github.com/TheBarnakhil/hate-speech-reporting/assets/142992581/cb015d06-6f32-4f17-9c84-5c02f25d21dd">

## Why is this tool unique?

The tool proposes combining web3 and AI tools to address the democratisation of ownership and governance of AI. The token engineering approach of responsible system design and aligning of incentives, paired with LLMs, create content moderation tool that has similarities to reinforcement learning from human feedback (RLHF), but it driven by community and common good. 

**Step 1. Self-reporting**

Players who experience hate speech have the option to report it.

**Step 2. Subjective vs imperfectly-objective**

Reports are checked by an AI agent who classifies them as hate speech or not (wrt to some protected characteristic). Players get LE (lived experience) points if those two agree.

**Step 3. Challenging the imperfectly-objective**

Players can challenge the AI agent result. Currently the only case when the challenge can happen is if the player believes that the model needs to consider a new protected characteristic. The player can submit a proposal to add that new characteristic to the set used by the model in the definition of hate speech.

**Step 4. Subjective experience vs community values.**

The community votes on the proposal to add new protected characteristic. This closes the subjective vs objective cycle, as the individual knows how it felt to be targeted by hate speech, but the community as a whole decides on what are the values that the community want to live by.

## Product Roadmap

**Voting mechanism**

1. Implementation of the first voting algorithm and voting mechanism. With the starting point of “1 person 1 vote”, the voting weights change according to accumulation of LE points, lower/higher constraints to those weights.

2. Perform simulations to assess various dynamics and edge cases, and to decide on alteration of the initial voting mechanism.

3. Reassessment of the mechanism requirements, implementation and simulations after other steps from the roadmap are completed.

**Increase community control over the LLM model**

1. Test on more LLMs, in particular open source ones, compare which can perform well without fine tuning, and which require fine tuning.

2. Community fine tuning: introduce the option for players to challenge the output of AI model by making a proposal to add their own experiences of being targeted by hate speech to training data.

**Proactive moderation**

After the community driven fine tuning leads to a model that performs well within the context of the game and with this particular community - it will be possible to start using the model to flag comments as potential hate speech while players are typing - and before they send the messages.

This would make a version of **reinforcement learning from human feedback** (RLHF) but with the feedback provided by humans whose **incentives are aligned** with the purpose of the system/community.

## References

Research on hate speech classification with few-shot classifiers, comparison of mdoels and prompting approaches

[Guo, Keyan, et al. "An investigation of large language models for real-world hate speech detection." 2023 International Conference on Machine Learning and Applications (ICMLA). IEEE, 2023](https://ieeexplore.ieee.org/abstract/document/10459901).

[Roy, Sarthak, et al. "Probing LLMs for hate speech detection: strengths and vulnerabilities." Findings of the Association for Computational Linguistics: EMNLP 2023. 2023](https://aclanthology.org/2023.findings-emnlp.407/).


## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v18.17)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

Clone this repo & install dependencies

```
git clone https://github.com/TheBarnakhil/hate-speech-reporting.git
cd hate-speech-reporting
yarn install
```

Start the application
```
yarn start

```



