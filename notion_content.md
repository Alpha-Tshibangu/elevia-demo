# Core Schema Architecture

The EUDM operates on five foundational entity types, each with standardized core fields but extensible schemas to accommodate source-specific enrichment:

```mermaid
graph TB
    UAR[Universal Asset Registry] --> TPL[Temporal Position Ledger]
    UAR --> EOG[Entity Ownership Graph]
    TPL --> TES[Transaction Event Stream]
    EOG --> TES
    TES --> DLT[Data Lineage Tracker]
    TPL --> DLT
    EOG --> DLT
    UAR --> DLT

    UAR --- UAR_Fields["• asset_id (canonical UUID)<br/>• identity_graph (weighted map)<br/>• asset_classification (hierarchical)<br/>• confidence_metadata"]
    TPL --- TPL_Fields["• position_id (canonical UUID)<br/>• asset_reference (links to UAR)<br/>• quantity_history (time-series)<br/>• valuation_stack (layered pricing)<br/>• ownership_path (hierarchical chain)"]
    EOG --- EOG_Fields["• entity_id (canonical UUID)<br/>• ownership_edges (directed graph)<br/>• consolidation_rules<br/>• corporate_action_hooks"]
    TES --- TES_Fields["• event_id (canonical UUID)<br/>• event_type (trade, dividend, etc.)<br/>• impact_cascade<br/>• execution_state"]
    DLT --- DLT_Fields["• source_metadata<br/>• quality_metrics<br/>• transformation_history"]
```

**Universal Asset Registry**
- `asset_id` (canonical UUID)
- `identity_graph` (weighted map of all known identifiers: CUSIP, ISIN, ticker, fund codes)
- `asset_classification` (hierarchical: security → instrument → issuer → sector)
- `confidence_metadata` (source reliability scores, last validation timestamp)

**Temporal Position Ledger**
- `position_id` (canonical UUID)
- `asset_reference` (links to Universal Asset Registry)
- `quantity_history` (time-series with confidence intervals)
- `valuation_stack` (layered pricing: real-time, delayed, estimated, stale)
- `ownership_path` (hierarchical chain from ultimate beneficial owner)

**Entity Ownership Graph**
- `entity_id` (canonical UUID for legal entities)
- `ownership_edges` (directed graph with percentage weights and effective dates)
- `consolidation_rules` (economic vs. voting vs. tax treatment)
- `corporate_action_hooks` (event triggers for automatic recalculation)

**Transaction Event Stream**
- `event_id` (canonical UUID)
- `event_type` (trade, dividend, spin-off, capital call, etc.)
- `impact_cascade` (predicted effects across ownership hierarchy)
- `execution_state` (pending, partial, complete, failed)

**Data Lineage Tracker**
- `source_metadata` (provider, endpoint, refresh frequency)
- `quality_metrics` (completeness, accuracy, timeliness scores)
- `transformation_history` (audit trail of all data mutations)

## Identity Graph for Universal Asset Registry

```mermaid
graph LR
    subgraph "Asset: Apple Inc"
        AAPL[AAPL Ticker<br/>Confidence: 95%]
        CUSIP[037833100<br/>Confidence: 98%]
        ISIN[US0378331005<br/>Confidence: 99%]
        LEI[HWUPKR0MPOU8FGXBT394<br/>Confidence: 92%]
        BBGID[BBG000B9XRY4<br/>Confidence: 97%]
    end

    AAPL -.->|Cross-validated| CUSIP
    CUSIP -.->|Primary link| ISIN
    ISIN -.->|Regulatory| LEI
    BBGID -.->|Market data| AAPL

    subgraph "Confidence Scoring"
        High["High (90%+)<br/>Primary identifiers"]
        Medium["Medium (70-89%)<br/>Derived mappings"]
        Low["Low (<70%)<br/>Unvalidated"]
    end
```

## Valuation Stack for Temporal Position Ledger

```mermaid
graph TD
    subgraph "Valuation Stack - Mixed Asset Portfolio"
        RT[Real-Time Layer<br/>Public Equities: 100% confidence<br/>Last updated: 15:30 EST]
        DT[Delayed Layer<br/>International Markets: 85% confidence<br/>Last updated: Previous close]
        EST[Estimated Layer<br/>Private Equity: 60% confidence<br/>Last updated: 45 days ago]
        STALE[Stale Layer<br/>Real Estate: 40% confidence<br/>Last updated: 90 days ago]
    end

    RT --> NAV_CALC[Confidence-Weighted NAV]
    DT --> NAV_CALC
    EST --> NAV_CALC
    STALE --> NAV_CALC

    NAV_CALC --> FINAL[Final NAV: $10.5M ± $0.8M<br/>Overall Confidence: 78%]

    subgraph "Decay Functions"
        PUB["Public: Exponential decay<br/>Half-life: 1 day"]
        PE["Private Equity: Linear decay<br/>Slope: -0.5% per day"]
        RE["Real Estate: Logarithmic decay<br/>Plateau at 30%"]
    end
```

## Entity Ownership Graph Hierarchy Example

```mermaid
graph TD
    FAM[Smith Family Trust<br/>Ultimate Beneficial Owner]

    FAM -->|40%| COMP_A[Company A Holdings LLC]
    FAM -->|25%| COMP_B[Company B Ventures]
    FAM -->|100%| DIRECT[Direct Investment Account]

    COMP_A -->|60%| HOLD_B[Holding Company B]
    COMP_A -->|80%| PE_FUND[PE Fund III LP]

    COMP_B -->|45%| REIT[Real Estate Investment Trust]

    HOLD_B -->|100%| IBKR[IBKR Trading Account]

    DIRECT -->|100%| SCHWAB[Schwab Brokerage]

    subgraph "Effective Ownership Calculation"
        CALC1[Company A → Holding B → IBKR<br/>40% × 60% × 100% = 24%]
        CALC2[Company A → PE Fund III<br/>40% × 80% = 32%]
        CALC3[Company B → REIT<br/>25% × 45% = 11.25%]
    end
```

## Transaction Event Stream State Machine

```mermaid
stateDiagram-v2
    [*] --> Pending: Corporate Action Announced

    Pending --> Analyzing: Event Processing Started
    Analyzing --> Impact_Assessment: Business Rules Applied

    Impact_Assessment --> Approved: Auto-approval conditions met
    Impact_Assessment --> Manual_Review: Complex scenario detected

    Manual_Review --> Approved: Human approval
    Manual_Review --> Rejected: Action declined

    Approved --> Executing: Implementation started
    Executing --> Partial: Interim state
    Partial --> Executing: Continue processing
    Executing --> Completed: All impacts processed

    Rejected --> [*]
    Completed --> [*]

    note right of Impact_Assessment
        Cascade Analysis:
        • Position adjustments
        • New entity creation
        • Rebalancing triggers
        • Tax implications
    end note

    note right of Executing
        State Machine Triggers:
        • Position updates
        • Cash movements
        • Document generation
        • Notification dispatch
    end note
```

## Universal Financial Data Adapter (UFDA) Architecture

```mermaid
graph TB
    subgraph "Data Sources"
        BLOOMBERG[Bloomberg Terminal]
        REFINITIV[Refinitiv Eikon]
        IBKR[Interactive Brokers]
        SCHWAB[Charles Schwab]
        PE_PORTAL[PE Fund Portals]
        CUSTODIAN[Prime Brokers]
    end

    subgraph "UFDA Adapter Layer"
        MKT_ADAPTER[Market Data Adapters]
        CUST_ADAPTER[Custodian Data Adapters]
        ALT_ADAPTER[Alternative Investment Adapters]
    end

    subgraph "EUDM Canonical Interface"
        NORM[Data Normalization Engine]
        QUAL[Quality Assessment]
        META[Metadata Enrichment]
        TEMP[Temporal Synchronization]
    end

    subgraph "EUDM Core"
        UAR2[Universal Asset Registry]
        TPL2[Temporal Position Ledger]
        EOG2[Entity Ownership Graph]
        TES2[Transaction Event Stream]
        DLT2[Data Lineage Tracker]
    end

    BLOOMBERG --> MKT_ADAPTER
    REFINITIV --> MKT_ADAPTER
    IBKR --> CUST_ADAPTER
    SCHWAB --> CUST_ADAPTER
    PE_PORTAL --> ALT_ADAPTER
    CUSTODIAN --> CUST_ADAPTER

    MKT_ADAPTER --> NORM
    CUST_ADAPTER --> NORM
    ALT_ADAPTER --> NORM

    NORM --> QUAL
    QUAL --> META
    META --> TEMP

    TEMP --> UAR2
    TEMP --> TPL2
    TEMP --> EOG2
    TEMP --> TES2
    TEMP --> DLT2
```

# How the EUDM Solves Each Puzzle

## 1. The Identity Crisis: Golden Record Creation

```mermaid
flowchart LR
    subgraph "Multi-Source Identity Problem"
        IBKR_ID[IBKR: AAPL]
        BBGID[Bloomberg: BBG000B9XRY4]
        PE_CODE[PE Fund: Internal Code 1001]
    end

    subgraph "Identity Graph Resolution"
        WEIGHT[Weighted Edge Creation<br/>Based on Source Reliability]
        CROSS[Cross-Validation Patterns]
        CONF[Confidence Scoring Algorithm]
    end

    subgraph "Golden Record"
        CANONICAL[Canonical UUID: 12345-abcd-6789]
        PRIMARY[Primary: ISIN US0378331005]
        ALIASES[Alias Map: All known identifiers]
        TRUST[Trust Score: 94%]
    end

    IBKR_ID --> WEIGHT
    BBGID --> WEIGHT
    PE_CODE --> WEIGHT

    WEIGHT --> CROSS
    CROSS --> CONF
    CONF --> CANONICAL

    CANONICAL --> PRIMARY
    CANONICAL --> ALIASES
    CANONICAL --> TRUST
```

The EUDM's **Universal Asset Registry** maintains an identity graph that doesn't force a single identifier but instead builds probabilistic links between all known identifiers. When IBKR provides a ticker, Bloomberg sends a CUSIP, and a PE fund PDF references an internal code, the system creates weighted edges between these identifiers, with confidence scores based on source reliability and cross-validation patterns. The "golden record" emerges naturally as the highest-confidence canonical representation.

## 2. The Time Paradox: Mixed-Frequency NAV

```mermaid
graph TD
    subgraph "Mixed-Frequency Asset Valuation"
        PUBLIC[Public Equities<br/>Real-time: $3.2M<br/>Confidence: 100%<br/>Decay: None]

        BOND[Fixed Income<br/>End-of-day: $1.8M<br/>Confidence: 95%<br/>Decay: 5% per day]

        PE[Private Equity<br/>45-day old: $4.1M<br/>Confidence: 65%<br/>Decay: Linear at 0.8%/day]

        RE[Real Estate<br/>90-day old: $1.4M<br/>Confidence: 40%<br/>Decay: Log function]
    end

    subgraph "Confidence-Weighted Calculation"
        WEIGHT_CALC[Weighted NAV Calculation<br/>Sum of Value x Confidence x Freshness]

        FINAL_NAV[Total NAV: $10.5M +/- $0.8M<br/>Overall Confidence: 78%<br/>Freshness Score: 0.82]
    end

    PUBLIC --> WEIGHT_CALC
    BOND --> WEIGHT_CALC
    PE --> WEIGHT_CALC
    RE --> WEIGHT_CALC

    WEIGHT_CALC --> FINAL_NAV
```

The **Temporal Position Ledger's** valuation stack handles this elegantly. Real-time equity prices occupy the top layer with 100% confidence, while 45-day old PE valuations sit lower with decaying confidence scores. The EUDM applies asset-class-specific staleness decay functions—public equities decay rapidly, real estate slowly. Total NAV becomes a confidence-weighted calculation where every component contributes based on its freshness and volatility profile, providing both a point estimate and confidence interval.

## 3. The Hierarchy Complexity: Look-Through Calculations

```mermaid
graph TD
    subgraph "Complex Ownership Structure"
        FAMILY[Smith Family Trust<br/>Ultimate Beneficial Owner]

        FAMILY -->|40%| COMP_A[Company A Holdings LLC]
        FAMILY -->|60%| COMP_B[Company B Ventures]

        COMP_A -->|60%| HOLDING[Holding Company B]
        COMP_A -->|30%| PE_FUND[PE Fund III LP]

        COMP_B -->|75%| REIT[REIT Investment]

        HOLDING -->|100%| IBKR_ACC[IBKR Account<br/>Portfolio: $2.5M]
    end

    subgraph "Recursive Calculation Engine"
        TRAVERSE[Graph Traversal Algorithm]
        CALC[Economic Interest Calculation<br/>40% x 60% x 100% = 24%]
        UPDATE[Cascade Update Triggers]
    end

    subgraph "Multi-View Consolidation"
        ECONOMIC[Economic View: 24% of $2.5M = $600K]
        VOTING[Voting View: 40% control path]
        TAX[Tax View: Pass-through entity]
    end

    IBKR_ACC --> TRAVERSE
    TRAVERSE --> CALC
    CALC --> UPDATE

    CALC --> ECONOMIC
    CALC --> VOTING
    CALC --> TAX
```

The **Entity Ownership Graph** recursively traverses ownership chains to calculate true economic exposure. When the family owns 40% of Company A → 60% of Holding B → IBKR Account C, the graph computes the effective 24% economic interest while maintaining separate voting and tax views. Changes at any level trigger cascade recalculations, ensuring consolidated reporting remains accurate even as ownership structures evolve.

## 4. Transactional Edge Cases: Complex Corporate Actions

```mermaid
flowchart TD
    subgraph "Corporate Action: Spin-off Event"
        ANNOUNCE[Spin-off Announced<br/>Company X → Company Y]

        ANALYZE[Impact Analysis Engine]

        CREATE_ENTITY[Create New Entity<br/>Company Y in ownership graph]

        ADJUST_POS[Position Adjustments<br/>Existing Company X holdings]

        TRIGGER_REBAL[Rebalancing Triggers<br/>Portfolio optimization engine]

        TAX_CALC[Tax Efficiency Analysis<br/>Optimal funding sources]
    end

    subgraph "State Machine Workflow"
        PENDING2[Pending State]
        PROCESSING[Processing State]
        EXECUTED[Executed State]
        COMPLETED2[Completed State]
    end

    subgraph "Cascade Effects"
        LIQUIDITY[Liquidity Analysis]
        CONVICTION[Conviction Scores]
        FUNDING[Funding Recommendations]
    end

    ANNOUNCE --> ANALYZE
    ANALYZE --> CREATE_ENTITY
    CREATE_ENTITY --> ADJUST_POS
    ADJUST_POS --> TRIGGER_REBAL
    TRIGGER_REBAL --> TAX_CALC

    ANNOUNCE --> PENDING2
    PENDING2 --> PROCESSING
    PROCESSING --> EXECUTED
    EXECUTED --> COMPLETED2

    TAX_CALC --> LIQUIDITY
    LIQUIDITY --> CONVICTION
    CONVICTION --> FUNDING
```

The **Transaction Event Stream** models corporate actions as state machines with impact cascades. A spin-off isn't just a single event—it's a workflow that creates new entities in the ownership graph, adjusts positions in the ledger, and may trigger rebalancing rules. Capital calls that require liquidation invoke the system's portfolio optimization engine, which considers tax efficiency, conviction scores, and liquidity profiles to recommend optimal funding sources.

# The Path Forward

The EUDM isn't just a data model—it's the architectural foundation for transforming how mid-tier family offices operate. By treating complexity, uncertainty, and temporal dynamics as first-class concepts rather than edge cases, we create a system that doesn't just aggregate data but truly synthesizes intelligence from the fragmented financial landscape.

This approach transforms the family office from a reactive administrator of wealth into a proactive orchestrator of sophisticated financial strategies, finally delivering on the promise of institutional-grade capabilities at mid-market scale.