# freedom-of-prediction

**Freedom of Prediction but not from Constitution**

A decentralized prediction market platform with first ever quantum market implmentation with conditional prediction market and LMSR bonding curves
Key features include -
- Integration with Eliza OS agents for autonomous market verification and resolution
- Automated posting of market status and results to Twitter for public transparency
- Use of Chainlink services to provide reliable data and automation, .


![](./pics/FOPlogo.jpeg)

### Some links
- [YouTube Demo Video](https://youtu.be/bgQiFNYzsFY)
- [Twitter Bot](https://x.com/predictor_85882)
- [Github](https://github.com/nikillxh/freedom-of-prediction)

# Frontend

ToDO

# Backend - eliza agent

![](./pics/eliza_workflow.png)

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