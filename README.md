## Mission Statement

We.Lived.It is an experimental tool in decentralised AI. It has been designed in line with the philosophy of Community Curated Models. We are using the context of online gaming but plan to scale this experiment to other online communities. We.Lived.It is a tool for people with lived experience of toxicity or marginalisation to reclaim these spaces.

## What are we hoping to achieve with this project?

For technology to properly serve people from various communities, it needs to be able to reflect the lived experience of people from those communities. This applies to AI and tools for hate speech recognition.

While we think that, ideally, all people creating technology should be practicing [technoreflexivity](https://kelsienabben.substack.com/p/techno-reflexivity-cf1331278bdc) and that online spaces should be accessible to all, this is not realistic and not necessary. Instead, what we should aim for is greater democratisation of decision-making and tools for sharing people’s lived experience and the knowledge that it provides.

We believe the solution lies in combining the power of technology (AI), methods for organising and governing in an accountable way (web3), and the appreciation of knowledge that lies within all members of a community (lived experience). The result is the Community Curated Model, see diagram below, which is tailored to and respects the values of the community which cooperated in its creation.

<img width="381" alt="Screenshot 2024-08-14 at 22 49 16" src="https://github.com/user-attachments/assets/209fdaa6-57d0-4853-8c4a-943cc0acd96a">


## What does this tool do?

User submits a report to the AI agent. 

AI Agent analyses the report and classifies it either as HATE SPEECH or NOT HATE SPEECH against a specific protected characteristic.

If the report is classified as hate speech, the player earns a Lived Experience (LE+) point. This gives them greater voting power in fine-tuning the AI Agent.

For example, if the model doesn't identify the report as hate speech or doesn't identify it under the right protected characteristic, a player can trigger a community vote to fine-tune the model and add an additional hate speech category.

If the vote is successful, the AI Model is updated. The player receives an LE point against the new category.

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

Research on hate speech classification with few-shot classifiers, comparison of models and prompting approaches

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



