# Freedom-of-prediction

### **It's Freedom of Prediction but not by the Constitution**
<img src="./pics/FOPlogo.jpeg" alt="Freedom of Prediction Logo" height="auto" />

## ⚛️ World's First Quantum Markets Implementation ⚛️

A decentralized prediction market platform featuring the **first ever implementation of quantum markets** - a groundbreaking approach that leverages conditional probability markets and **LMSR bonding curves** to create multi-dimensional prediction scenarios.

### Key Features
- **Quantum Markets**: Revolutionary implementation allowing for interconnected, conditional outcome predictions
- **Eliza OS Integration**: AI agents for autonomous market verification and resolution
- **Social Media Integration**: Automated posting of market status and results to **Twitter/X** for public transparency
- **Blockchain Oracle**: **Chainlink** functions for communicating with external functions for data

### The Analogy with Conditional Prediction Markets
<img src="./pics/fop_graph.png" alt="Quantum Market Illustration" height="auto" />

### Working Mechanism
<img src="./pics/fop_qm.png" alt="Quantum Market Illustration" height="auto" />

### Platform Structure
<img src="./pics/fop_1.png" alt="FOP Platform Interface" height="auto" />

### LMSR Bonding Curves
<img src="./pics/fop_graphs.png" alt="Market Probability Graphs" height="auto" />

### Bonding Curves Comparison
<img src="./pics/fop_coparison.png" alt="Market Comparison Analysis"  height="auto" />

### Market Variables
<div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
  <img src="./pics/fop_fc.png" alt="Freedom of Prediction Flow Chart" width="48%" style="max-width: 400px;" />
  <img src="./pics/fop_fc2.png" alt="Freedom of Prediction Flow Chart 2" width="48%" style="max-width: 400px;" />
</div>

### The NO track victory analysis
<img src="./pics/noTrackAnalysis.png" alt="Market Comparison Analysis" />

### Some links
- [YouTube Demo Video](https://youtu.be/bgQiFNYzsFY)
- [Twitter Bot](https://x.com/predictor_85882)
- [Github](https://github.com/nikillxh/freedom-of-prediction)

## Frontend

Check out `prediction` folder!

## Backend - eliza agent

<img src="./pics/eliza_workflow.png" alt="Eliza Workflow Diagram" height="auto" />

### How To Run

```bash
cd eliza-backend
```

### validator agent (port - 4000)
```bash
cd eliza-validator
pnpm i
pnpm build
pnpm start --characters="characters/predictorx.character.json"
```


### twitter agent (port - 4001)
```bash
cd eliza-twitter
pnpm i
pnpm build
pnpm start --characters="characters/posterx.character.json"
```

### resolver agent (port - 4002)
```bash
cd eliza-resolver
pnpm i
pnpm build
pnpm start --characters="characters/resolverx.character.json"
```

### Testing agent
```bash
cd test-agent
npm i
tsc testAgent.ts
node testAgent.js
```

## Analysis
### Problems Solved
1. Decentralized Market Creation for preventing centralization during Market Creation.
2. World's first Quantum Market implementation, integrated with Conditional Prediction Market to solve the problem of capital requirement & making better use of capital for prediction by enabling users to model opinions in each track of a Market by using the total capital staked in the Market for each track individually!
3. Unique Market Resolution Mechanism, valuing both, the "YES" & "NO" tracks in the market instead of just "YES" or "NO", leading to better prediction, as users have to model their opinions properly for each track (instead of buying in only one track) for getting rewarded.
4. Used ElizaOS for Twitter/X tweet on Market Creation & Market Resolution. 
5. Decentralized Market Resolution powered by Eliza OS bridged with Chainlink function.
6. LMSR bonding curves instead of the classic Linear or Quarter Circle curves. Leading to better market manipulation resistance & better prediction.
7. A completely Permissionless & Decentralized Conditional + Quantum Prediction Market!

### Challenges Faced
1. Integrating elizaos was pretty tough, needed to used eliza-starter kit which had limited options, in contrast to elizaos-cli version.
2. Twitter bot was challenging, aligning the agent to post only the data which is essentioal was quite difficult.
3. Inventing a completely new market resolution mechanism for this unique market & better incentivization of future prediction.
4. Chainlink functions work fine on Sepolia. Faced difficulty setting up & running Chainlink functions on Localhost.