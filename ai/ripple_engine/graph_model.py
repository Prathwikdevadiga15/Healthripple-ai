"""
Supply network graph model.

Builds a NetworkX graph of facilities (nodes) and supply/redistribution
routes (edges) from the synthetic dataset. This is the substrate the
ripple-propagation and redistribution-optimization engines both operate on.
"""
from __future__ import annotations

import pandas as pd
import networkx as nx


def build_graph(facilities_df: pd.DataFrame, routes_df: pd.DataFrame) -> nx.DiGraph:
    g = nx.DiGraph()
    for _, row in facilities_df.iterrows():
        g.add_node(
            row["facility_id"],
            name=row["name"],
            facility_type=row["facility_type"],
            district=row["district"],
            lat=row["latitude"],
            lng=row["longitude"],
            capacity=row["capacity"],
            safety_stock_days=row["safety_stock_days"],
        )
    for _, row in routes_df.iterrows():
        g.add_edge(
            row["from_facility"],
            row["to_facility"],
            route_id=row["route_id"],
            distance_km=row["distance_km"],
            travel_time_hr=row["travel_time_hr"],
        )
        # redistribution routes are usable in both directions between
        # non-warehouse facilities; warehouse -> facility stays one-way
        if g.nodes[row["from_facility"]]["facility_type"] != "warehouse":
            g.add_edge(
                row["to_facility"], row["from_facility"],
                route_id=row["route_id"] + "-R",
                distance_km=row["distance_km"], travel_time_hr=row["travel_time_hr"],
            )
    return g


def neighbors_within_hops(g: nx.DiGraph, facility_id: str, hops: int = 2):
    """Facilities reachable from facility_id within `hops` edges (undirected sense)."""
    ug = g.to_undirected()
    lengths = nx.single_source_shortest_path_length(ug, facility_id, cutoff=hops)
    return [fid for fid in lengths if fid != facility_id]
