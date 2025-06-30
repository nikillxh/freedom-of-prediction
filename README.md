# Freedom-of-prediction

**Freedom of Prediction but not from Constitution**
<img src="./pics/FOPlogo.jpeg" alt="Freedom of Prediction Logo" width="600" height="auto" />

A decentralized prediction market platform with **first ever quantum market** implmentation with conditional prediction market and **LMSR bonding curves**
Key features include -
- Integration with **Eliza OS** agents for autonomous market verification and resolution
- Automated posting of market status and results to **Twitter** for public transparency
- Use of **Chainlink** services to provide reliable data and automation, .


<img src="./pics/fop_qm.png" alt="Freedom of Prediction Logo" width="700" height="auto" />
<img src="./pics/fop_1.png" alt="Freedom of Prediction Logo" width="700" height="auto" />
<img src="./pics/fop_graphs.png" alt="Freedom of Prediction Logo" width="700" height="auto" />
<img src="./pics/fop_coparison.png" alt="Freedom of Prediction Logo" width="700" height="auto" />

<div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
  <img src="./pics/fop_fc.png" alt="Freedom of Prediction Flow Chart" width="48%" style="max-width: 400px;" />
  <img src="./pics/fop_fc2.png" alt="Freedom of Prediction Flow Chart 2" width="48%" style="max-width: 400px;" />
</div>

### Some links
- [YouTube Demo Video](https://youtu.be/bgQiFNYzsFY)
- [Twitter Bot](https://x.com/predictor_85882)
- [Github](https://github.com/nikillxh/freedom-of-prediction)

# Frontend

ToDO

# Backend - eliza agent

<img src="./pics/eliza_workflow.png" alt="Eliza Workflow Diagram" width="600" height="auto" />

## How To Run

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