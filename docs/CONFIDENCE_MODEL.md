# Confidence Model & Feature Weighting Specification

## Mathematical Formulation

The TRUSTIQ AI Confidence Estimation Engine calculates a normalized confidence score $S \in [0, 100]$ using available empirical signals and explicit penalty subtractions.

$$S = \max\left(0, \min\left(100, \sum_{i \in \text{Available}} w_i \cdot s_i - P\right)\right)$$

Where:
- $s_i \in [0, 100]$ is the raw signal score.
- $w_i$ is the normalized feature weight over available signals ($\sum w_i = 1.0$).
- $P$ is the total sum of applied negative indicator penalties.

### Base Feature Weights ($w_i$)

| Signal | Base Weight | Description |
| :--- | :--- | :--- |
| **Evidence Quality** | 25% | Source reliability and verification proof quality |
| **Evidence Coverage** | 20% | Ratio of extracted claims backed by evidence |
| **Verification Outcome** | 25% | Result of AST math, schema, or consistency check |
| **Model Confidence** | 10% | Self-reported or log-probability score |
| **Historical Task Reliability** | 10% | Historical accuracy for similar task category |
| **Multi-Sample Agreement** | 10% | Consensus agreement across independent candidate responses |

### Negative Indicator Penalties ($P$)

- **Failed Verification**: $-35.0$ points
- **Detected Contradictions**: $-30.0$ points
- **Prompt Ambiguity**: $-20.0$ points
- **Missing Context Items**: $-10.0$ points per missing required detail (up to $-30.0$)

> [!IMPORTANT]
> **Scoring Disclaimer**: Estimated confidence is an empirical reliability score designed for decision policy routing. It is not a statistically calibrated probability guarantee.
