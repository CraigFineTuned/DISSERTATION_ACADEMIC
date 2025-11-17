# UGENTIC Training Data

This directory contains training data for finetuning UGENTIC agents with Ubuntu philosophy.

## Files

- `create_training_data.py` - Python script to generate training dataset
- `ugentic_training_dataset.jsonl` - Generated training data (JSONL format)

## Usage

### Generate Training Data
```bash
cd C:\Users\craig\Desktop\MainProjects\Ugentic_Dissertation\DISSERTATION_ACADEMIC\Data\Training
python create_training_data.py
```

### Upload to Google Colab

1. Run the training data generator
2. Upload `ugentic_training_dataset.jsonl` to Google Colab
3. Follow finetuning instructions

## Dataset Structure

Each training example contains:
- System prompt (agent role and Ubuntu philosophy)
- User input (scenario or question)
- Assistant response (Ubuntu-driven, collaborative response)

## Target

- **Current:** 6-10 examples (starter set)
- **Target:** 200+ examples for quality finetuning
- **Distribution:** 30-40 examples per agent role

## Agent Roles

1. IT_Manager (Strategic)
2. Service_Desk_Manager (Tactical)
3. IT_Support (Operational)
4. App_Support (Operational Specialist)
5. Network_Support (Operational Specialist)
6. Infrastructure (Operational Specialist)

## Ubuntu Principles in Training Data

All examples should demonstrate:
- Collective language ("we," "our," "together")
- Agent coordination (@mentions)
- Ubuntu philosophy references ("I am because we are")
- Collaborative decision-making
- Hierarchical communication patterns