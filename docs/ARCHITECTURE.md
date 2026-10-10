# TRUSTIQ AI System Architecture

TRUSTIQ AI is structured around a modular, 14-step trust decision pipeline designed to evaluate uncertainty, classify risk, execute modular verification, and apply configurable routing policies before responding.

## High-Level System Architecture Diagram

```mermaid
graph TD
    User["User Prompt"] --> Gateway["API Gateway / FastAPI /api/v1"]
    Gateway --> Pipeline["Decision Pipeline Service"]
    
    subgraph Core Pipeline
        Pipeline --> CategoryScanner["Task Category & Ambiguity Scanner"]
        CategoryScanner --> RiskEngine["Risk Assessment Engine"]
        RiskEngine --> LLMProvider["LLM Provider (Demo/OpenAI/Anthropic)"]
        LLMProvider --> VerificationEngine["Verification Engine Suite"]
        
        subgraph Verification Tools
            VerificationEngine --> MathParser["AST Safe Math Evaluator"]
            VerificationEngine --> ClaimsMatcher["Claim & Evidence Matcher"]
            VerificationEngine --> ContradictionCheck["Contradiction Detector"]
        end
        
        VerificationEngine --> ConfidenceEngine["Multi-Signal Confidence Engine (0-100)"]
        ConfidenceEngine --> RoutingEngine["Smart Policy Routing Engine"]
    end
    
    RoutingEngine --> ActionSelector{"Selected Action Route"}
    
    ActionSelector -->|High Conf & Low Risk| DirectAnswer["ANSWER: Direct Response"]
    ActionSelector -->|Needs Verification| VerifyRoute["VERIFY: Verification Tools"]
    ActionSelector -->|Ambiguous/Missing Info| ClarifyRoute["CLARIFY: User Question"]
    ActionSelector -->|Domain Task| SpecialistAgent["SPECIALIST: Domain Agent"]
    ActionSelector -->|High Risk / Low Conf| EscalateRoute["ESCALATE: Human Review Queue"]
    ActionSelector -->|Policy Violation| DeclineRoute["DECLINE: Refuse Action"]
    
    EscalateRoute --> ReviewQueue["Human Reviewer Workflow"]
    
    DirectAnswer --> Database[("SQLite / PostgreSQL Database")]
    VerifyRoute --> Database
    ClarifyRoute --> Database
    SpecialistAgent --> Database
    EscalateRoute --> Database
    DeclineRoute --> Database
    
    Database --> Frontend["React 18 + Vite + Tailwind Frontend"]
```

## Component Overview

1. **FastAPI REST API**: Handles authentication, user management, decision persistence, evaluation runs, and audit logging.
2. **Confidence Estimation Engine**: Normalizes empirical signals into a 0-100 score with explicit feature weights.
3. **Risk Assessment Engine**: Classifies operational risk independently from confidence scores.
4. **Verification Engine**: Implements AST math parsing, JSON schema validation, and contradiction detection.
5. **Human Review Queue**: Manages escalated cases with role-based reviewer approval workflows.
6. **Evaluation Laboratory**: Offline benchmark engine measuring accuracy, hallucination rate, and appropriate escalation rates.
