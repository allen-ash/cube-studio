import { ITNodeDetail } from "../../pages/BloodRelation/NodeDetail";

export interface IBloodRelationNode {
    node_id: string;
    node_name: string;
    node_type: TBloodRelationNodeType;
    status: TBloodRelationNodeStatus;
    parent: IBloodRelationNode[]
    children: IBloodRelationNode[]
}

export type TBloodRelationNodeType = 'TDW' | 'CK' | 'US' | 'VENUS' | 'TDBANK' | 'TESLA' | 'SP_DASHBOARD' | 'SP_CHART' | 'LP' | 'COLLECT'

export type TBloodRelationNodeStatus = 'Y' | 'F' | 'L' | 'C' | 'D' | 'U'
export interface IBloodRelationParams {
    nodeId: string
    nodeType: TBloodRelationNodeType
    depthChildren: number
    depthParent: number
}

export interface IBloodRelationNodeDetailItem {
    cn: string
    key: string
    value: string
    type: ITNodeDetail
}