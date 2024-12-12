# aide

A tool for rapid development of AI-native APIs.

[aide link](https://aide-three.vercel.app/app)

## Currently Supported Nodes

Nodes are the building blocks of the API. They are connected to form a graph that defines the agent behind the workflow.

### Prompt Node

Node that takes in a prompt and returns a response from a desired LLM. It can take a response from another LLM or an input from API.

### API Input

This node refers to the input from API. You can send a JSON object to the API and it will be accessed according to the name you specify in this block.

### API Output

This node refers to the output from API. A JSON object will be sent as a response from the API.

## Develpment Plan

- [x] Create a basic UI for the tool
- [ ] New nodes
  - [ ] Vector database
  - [ ] Tools
  - [ ] Python/JS execution
  - [ ] File I/O



