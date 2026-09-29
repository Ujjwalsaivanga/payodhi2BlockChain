"""Payodhi core package.

Analysis pipeline stages 1-5. Each subpackage maps to a pipeline stage from
the SIH 26160 NTRO specification:

    ingestion   -> Stage 1  Ingestion Engine             (Wire & PCAP)
    ike_parser  -> Stage 2  RFC 7296 IKEv1/IKEv2 Parser  (Handshake Decoder)
    flow        -> Stage 3  ESP/AH Flow Feature Extractor (13 Side-Channel Metrics)
    classifiers -> Stage 4a Protocol/Crypto Fallback
                   Stage 4b Traffic-Type Classifier       (Random Forest, 98% Macro-F1)
    rules       -> Stage 4c Security Rule Engine          (RFC 8221, NIST, Post-Quantum)

Payodhi Engineering Architecture (SIH 26160 · NTRO).
"""

__version__ = "1.0.0"
