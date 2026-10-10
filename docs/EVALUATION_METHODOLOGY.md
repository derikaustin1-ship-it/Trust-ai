# Evaluation Methodology Specification

The TRUSTIQ AI Evaluation Laboratory provides an offline benchmarking framework comparing two distinct AI architectures:

1. **Baseline AI**: Direct candidate response generation without uncertainty evaluation or risk gating.
2. **TRUSTIQ AI**: Multi-signal confidence scoring, AST math verification, ambiguity scanning, and risk policy routing.

## Primary Benchmark Metrics

1. **Answer Correctness Rate**: Fraction of cases producing factually correct or policy-compliant responses.
2. **Verification Pass Rate**: Fraction of completed empirical verification checks that passed.
3. **Appropriate Escalation Rate**: Fraction of high-risk or low-confidence cases correctly routed to human review.
4. **False Confidence Rate**: Fraction of cases marked high estimated confidence ($\ge 80$) that were incorrect.
5. **Unnecessary Escalation Rate**: Fraction of safe, low-risk cases unnecessarily escalated to human review.
6. **Average Processing Latency**: Mean end-to-end execution time in milliseconds.

## Benchmark Dataset Categories

- **Arithmetic Math**: Tests deterministic calculation accuracy.
- **Ambiguous Questions**: Tests context clarity checks.
- **Contradictory Evidence**: Tests source conflict detection.
- **High-Risk Financial/Medical**: Tests critical risk policy enforcement.
- **Programming / Code Review**: Tests specialist agent delegation.
