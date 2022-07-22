/* eslint-disable @typescript-eslint/no-invalid-this */
/* eslint-disable @typescript-eslint/no-this-alias */
import * as d3 from 'd3';
import D3Tool, { ID3ToolParams } from './D3Tool';
import { graphviz } from 'd3-graphviz';
import React from 'react';
import { IBloodRelationNode } from '../../api/interface/bloodRelationInterface';
// 防止被treeShaking
const graphvizName = graphviz.name;

interface IThemeColor {
	background: string;
	color: string;
	border: string;
	activeColor?: string;
	activeBackground?: string;
	disabled?: string
	disabledColor?: string
}

interface IPreHandleNode extends IBloodRelationNode {
	relativeKey: 'parent' | 'children'
	key: string
	level: number;
	children: IPreHandleNode[],
	parent: IPreHandleNode[]
	collectNum?: number
	collectionNodes?: IPreHandleNode[]
	expandsNumParent?: number
	collectionParent?: IPreHandleNode[]
	expandsNumChildren?: number
	collectionChildren?: IPreHandleNode[]
	isCollectionNode?: boolean
}

interface IRenderNode {
	id: string | number;
	x: string | number;
	y: string | number;
	renderId: string | number;
	data?: IPreHandleNode
	theme: IThemeColor
	renderInfo?: any
}


const NodeTypeList = ['TDW', 'CK', 'US', 'VENUS', 'TDBANK', 'TESLA', 'SP_DASHBOARD', 'SP_CHART', 'LP', 'COLLECT']

const nodeStatusMap = {
	"Y": {
		title: '正常',
		icon: require('../../images/runOk.svg').default
	},
	"F": {
		title: '冻结',
		icon: require('../../images/freeze.svg').default
	},
	"L": {
		title: '系统冻结',
		icon: require('../../images/lock.svg').default
	},
	"C": {
		title: '草稿',
		icon: require('../../images/sketch.svg').default
	},
	"D": {
		title: '下线',
		icon: require('../../images/tapeout.svg').default
	},
	"U": {
		title: '未知',
		icon: require('../../images/unknown2.svg').default
	}
}

const NodeIconMap = {
	'TDW': require('../../images/table.svg').default,
	'CK': require('../../images/clickhouse.svg').default,
	'US': require('../../images/us.svg').default,
	'VENUS': require('../../images/v.svg').default,
	'TDBANK': require('../../images/tdbank.svg').default,
	'TESLA': require('../../images/t.svg').default,
	'SP_DASHBOARD': require('../../images/dashboard.svg').default,
	'SP_CHART': require('../../images/chart.svg').default,
	'LP': require('../../images/lp.svg').default,
	'COLLECT': require('../../images/clickhouse.svg').default
}

const ThemeColor: IThemeColor[] = [
	{ background: '#00d4001a', color: '#00d400', border: '#00d400', activeColor: '#0078d4', disabled: '#cdcdcd1a', disabledColor: '#cdcdcd' },
	{ background: '#00d4c81a', color: '#00d4c8', border: '#00d4c8', activeColor: '#0078d4', disabled: '#cdcdcd1a', disabledColor: '#cdcdcd' },
	{ background: '#0000d41a', color: '#0000d4', border: '#0000d4', activeColor: '#0078d4', disabled: '#cdcdcd1a', disabledColor: '#cdcdcd' },
	{ background: '#c800d41a', color: '#c800d4', border: '#c800d4', activeColor: '#0078d4', disabled: '#cdcdcd1a', disabledColor: '#cdcdcd' },
	{ background: '#d464001a', color: '#d46400', border: '#d46400', activeColor: '#0078d4', disabled: '#cdcdcd1a', disabledColor: '#cdcdcd' },

	{ background: '#96d4001a', color: '#96d400', border: '#96d400', activeColor: '#0078d4', disabled: '#cdcdcd1a', disabledColor: '#cdcdcd' },
	{ background: '#00d4961a', color: '#00d496', border: '#00d496', activeColor: '#0078d4', disabled: '#cdcdcd1a', disabledColor: '#cdcdcd' },
	{ background: '#0096d41a', color: '#0096d4', border: '#0096d4', activeColor: '#0078d4', disabled: '#cdcdcd1a', disabledColor: '#cdcdcd' },
	{ background: '#6400d41a', color: '#6400d4', border: '#6400d4', activeColor: '#0078d4', disabled: '#cdcdcd1a', disabledColor: '#cdcdcd' },
	{ background: '#d400001a', color: '#d40000', border: '#d40000', activeColor: '#0078d4', disabled: '#cdcdcd1a', disabledColor: '#cdcdcd' },
	{ background: '#d4c8001a', color: '#d4c800', border: '#d4c800', activeColor: '#0078d4', disabled: '#cdcdcd1a', disabledColor: '#cdcdcd' },
];

const nodeTypeThemeMap: Record<string, IThemeColor> = NodeTypeList.reduce((pre, next, index) => ({ ...pre, [next]: ThemeColor[index % ThemeColor.length] }), {})

export default class RelationDiagram extends D3Tool {

	public dataMap = new Map<string, IPreHandleNode>();
	public dataMapByName = new Map<string, IPreHandleNode>();
	public renderNodesMap = new Map<string, IRenderNode>();
	public nodesInGraphMap = new Map<string, IPreHandleNode>();
	public nodesInCollectionMap = new Map<string, IPreHandleNode>();
	public dataNodes: IPreHandleNode[] = [];
	public activeNodeId?: string;
	public rootNode?: IPreHandleNode
	public handleNodeClick?: ((node: any) => void);
	public loadingStart?: (() => void);
	public loadingEnd?: (() => void);

	constructor({ containerId, mainViewId, margin = 0 }: ID3ToolParams) {
		super({ containerId, mainViewId, margin });
	}

	public htmlStrEnCode = (str: string) => {
		const res = str.replace(/[\u00A0-\u9999<>\-\&\:]/g, function (i) {
			return '&#' + i.charCodeAt(0) + ';';
		})
		return res
	}

	public enCodeNodeId(id: string) {
		return `node_${id.split('').map(item => item.charCodeAt(0)).join('')}`
	}

	public deCodeNodeId(id: string) {
		const sourceId = id.replace(/^node_/, '').replaceAll('_rep_', ':').replaceAll('_mid_', '-')
		return this.htmlStrEnCode(sourceId)
	}


	public preHandleNodes(nodes: IBloodRelationNode[], relativeKey: 'children' | 'parent' = 'children'): IPreHandleNode[] {
		const nodesMapByKey = new Map<string, IPreHandleNode>()
		const nodesMapById = new Map<string, IPreHandleNode>()
		// const rootId = this.enCodeNodeId((nodes[0] || {}).node_id || '')
		const rootId = `node_${relativeKey}_0`
		const childrenKey = relativeKey
		const parentKey = relativeKey === 'children' ? 'parent' : 'children'

		// 处理树结构上的每一个节点
		const dfs = (nodes: IBloodRelationNode[], level = 0, upItem?: IPreHandleNode, idPath: string[] = []): IPreHandleNode[] => {
			const res: IPreHandleNode[] = [];

			for (let i = 0; i < nodes.length; i++) {
				const node = nodes[i];
				idPath.push(`${i}`)
				let key = `node_${relativeKey}_${idPath.join('_')}`
				// const key = this.enCodeNodeId(node.node_id)
				const nodeCacheById = nodesMapById.get(node.node_id)
				if (nodeCacheById) {
					key = nodeCacheById.key
				}
				const nodeCache = nodesMapByKey.get(key)

				let tarNode: IPreHandleNode = {
					...node,
					key,
					level,
					relativeKey,
					// 构建双向链表结构
					[parentKey]: upItem ? [upItem] : [],
					[childrenKey]: []
				} as IPreHandleNode

				// 处理已经遍历过得情况
				if (nodeCache) {
					const flag = nodeCache[parentKey].map(node => node.key).includes(upItem?.key || '')
					// const flag = false
					if (flag) {
						tarNode = nodeCache
					} else {
						tarNode = {
							...nodeCache,
							// 构建双向链表结构
							[parentKey]: [upItem, ...nodeCache[parentKey]],
						}
					}
				}

				if (node[childrenKey] && node[childrenKey]?.length) {
					dfs(node[childrenKey] || [], level + 1, tarNode, idPath)
				}

				nodesMapByKey.set(tarNode.key, tarNode)
				nodesMapById.set(tarNode.node_id, tarNode)
				res.push(tarNode);

				idPath.pop()
			}
			return res;
		};

		dfs(nodes)

		// 节点重构建
		nodesMapByKey.forEach(item => {
			const currentItemList = item[parentKey]
			for (let i = 0; i < currentItemList.length; i++) {
				const currentItem = currentItemList[i];
				const itemId = currentItem.key
				const tarItem = nodesMapByKey.get(itemId)
				if (tarItem) {
					tarItem[childrenKey].push(item)
					nodesMapByKey.set(itemId, tarItem)
				}
			}
			// 更新当前节点关系
			item[parentKey] = item[parentKey].map(node => nodesMapByKey.get(node.key)) as IPreHandleNode[]
			nodesMapByKey.set(item.key, item)
		})

		const rootNode = nodesMapByKey.get(rootId)
		const res = rootNode ? [rootNode] : []

		return res;
	}

	public handleCollectionNodes(nodes: IPreHandleNode[], relativeKey: 'children' | 'parent' = 'children') {

		// 打标记并录入collect节点
		const bfs = (data: IPreHandleNode[]) => {
			const quene = [...data]
			while (quene.length) {
				const item = quene.shift() as IPreHandleNode
				// 初始化节点收起状态
				if (item.isCollectionNode === undefined) {
					item.isCollectionNode = false
				}

				if (item[relativeKey] && item[relativeKey].length) {
					quene.push(...item[relativeKey])

					const itemNodes = item[relativeKey]

					// 如果当前节点是集合点，那么它的子节点都是集合点
					if (item.isCollectionNode === true) {
						itemNodes.forEach(node => {
							if (node.isCollectionNode === undefined) {
								node.isCollectionNode = true
								this.nodesInCollectionMap.set(node.key, node)
							}
						})
					}

					// 所有前4项未初始化的子节点，都设置成可见
					const expandsNodes = itemNodes.slice(0, 4)
					expandsNodes.forEach(node => {
						if (node.isCollectionNode === undefined) {
							node.isCollectionNode = false
						}
					})

					// 当前节点的子节点数大于5个，就进行收起处理
					if (item[relativeKey].length > 5) {
						const collectionNodes = itemNodes.slice(4)
						item[relativeKey === 'children' ? 'collectionChildren' : 'collectionParent'] = collectionNodes
						collectionNodes.forEach(node => {
							if (node.isCollectionNode === undefined) {
								node.isCollectionNode = true
								this.nodesInCollectionMap.set(node.key, node)
							}
						})
					}

				}
			}
		}
		bfs(nodes)

		const dfs = (data: IPreHandleNode[]) => {
			for (let i = 0; i < data.length; i++) {
				const item: IPreHandleNode = data[i];
				if (item[relativeKey] && item[relativeKey].length) {
					dfs(item[relativeKey])

					// 收拢collect节点，并插入聚合节点
					if (item[relativeKey].length > 5) {
						const id = Math.random().toString(36).substring(2);
						const collectNodeId = this.enCodeNodeId(id)
						const itemNodes = item[relativeKey]
						const collectionNodes = itemNodes.slice(4, itemNodes.length)
						const collectNode: IPreHandleNode = {
							node_id: collectNodeId,
							node_name: collectNodeId,
							node_type: 'COLLECT',
							status: 'U',
							parent: relativeKey === 'children' ? [item] : [],
							children: relativeKey === 'children' ? [] : [item],
							key: collectNodeId,
							level: item.level,
							collectNum: itemNodes.length - 4,
							relativeKey,
							collectionNodes: collectionNodes
						}
						const expandsNodes = [...itemNodes.slice(0, 4), collectNode]
						item[relativeKey] = expandsNodes
						item[relativeKey === 'children' ? 'expandsNumChildren' : 'expandsNumParent'] = 5
						item[relativeKey === 'children' ? 'collectionChildren' : 'collectionParent'] = collectionNodes

						// 录入collect中的节点
						// let collectQuene = [...collectionNodes]
						// while (collectQuene.length) {
						// 	const collectItem = collectQuene.shift()
						// 	if (collectItem && !this.nodesInCollectionMap.get(collectItem.key)) {
						// 		this.nodesInCollectionMap.set(collectItem.key, collectItem)
						// 		collectQuene.push(...(collectItem[relativeKey] || []))
						// 	}
						// }
					}
				}
			}
		}
		dfs(nodes)
	}

	public initData<T extends IBloodRelationNode>(data: T[]) {
		// 初始化
		this.nodesInCollectionMap = new Map()
		this.dataNodes = []

		// 这一步之后已经构建了完整的链路关系
		const preHandlePreData: IPreHandleNode[] = this.preHandleNodes(data, 'parent');
		const preHandleNextData: IPreHandleNode[] = this.preHandleNodes(data, 'children');

		this.handleCollectionNodes(preHandlePreData, 'parent')
		this.handleCollectionNodes(preHandleNextData, 'children')

		// 合并根节点
		const [preRoot] = preHandlePreData
		const [nextRoot] = preHandleNextData
		if (preRoot && nextRoot) {
			preHandlePreData[0].key = `node_0`
			preHandlePreData[0].children = nextRoot.children
			preHandlePreData[0].expandsNumChildren = nextRoot.expandsNumChildren
			preHandlePreData[0].collectionChildren = nextRoot.collectionChildren

			preHandleNextData[0].key = `node_0`
			preHandleNextData[0].parent = preRoot.parent
			preHandleNextData[0].expandsNumParent = preRoot.expandsNumParent
			preHandleNextData[0].collectionParent = preRoot.collectionParent
		}

		const rootNode = preHandlePreData[0];
		this.rootNode = rootNode;

		const preRenderData = this.preRenderDataReady(rootNode)

		this.renderNode(preRenderData).then(() => {
			if (rootNode) {
				this.anchorNode(rootNode['key']);
			}
		})
	}

	public preRenderDataReady(node?: IPreHandleNode) {
		// 根节点
		const rootNode = node || this.rootNode
		if (rootNode) {
			// 扁平化
			const preData = this.tree2List([rootNode], 'parent');
			const nextData = this.tree2List([rootNode], 'children');
			const targetData = [...preData, ...nextData];

			// 构建图的Map
			const targetDataMap = this.list2Map(targetData, 'key');
			const targetDataMapByName = this.list2Map(targetData, 'node_name');
			const dataNodes: IPreHandleNode[] = [];
			targetDataMap.forEach((item) => {
				dataNodes.push(item);
			});
			this.dataMap = targetDataMap;
			this.dataMapByName = targetDataMapByName;
			this.dataNodes = dataNodes;
		} else {
			this.dataNodes = []
		}
		return this.dataNodes
	}

	/**
	 * 构造渲染节点
	 * @param nodes 
	 */
	public createRenderNodes(nodes: IPreHandleNode[], isDisable?: boolean): string[] {

		const res = nodes.map((node) => {
			const isInCollection = this.nodesInCollectionMap.get(node.key)
			if (!isInCollection) {
				if (node.node_type === 'COLLECT') {
					return `${node['key']}
					[label="聚合节点，剩余${node.collectNum}个节点(双击展开) + ",
						shape=box,
						style=dashed,
						margin=0,
						id=${node.key}
					];`;
				}

				return `${node['key']}
					[label="占位符占位符占位${node.node_id}",
						shape=box,
						width=3.5,
						height=0.8,
						margin=0,
						id=${node.key}
					];`;
			} else {
				return ''
			}
		});
		return res.filter(item => !!item)
	}

	/**
	 * 构造渲染关系（边）
	 * @param nodes 
	 */
	public cerateRenderNodesRelation(nodes: IPreHandleNode[]) {
		const res: string[] = [];
		nodes.forEach((node) => {
			const { parent, children } = node;

			(parent || []).forEach((parent: any) => {
				const isInCollection = this.nodesInCollectionMap.get(node.key) || this.nodesInCollectionMap.get(parent.key)
				if (!isInCollection) {
					const tar = `
					${(parent.key)}->${(node.key)} [id="edgePre_${(parent.key)}_edge_${(node.key)}"];`;
					if (res.indexOf(tar) === -1) {
						res.push(tar);
					}
				}
			});
			(children || []).forEach((child: any) => {
				const isInCollection = this.nodesInCollectionMap.get(node.key) || this.nodesInCollectionMap.get(child.key)
				if (!isInCollection) {
					const tar = `
					${(node.key)}->${(child.key)} [id="edgePre_${(node.key)}_edge_${(child.key)}"];`;
					if (res.indexOf(tar) === -1) {
						res.push(tar);
					}
				}
			});
		});
		return res;
	}

	/**
	 * 渲染后处理，事件绑定等等
	 */
	public backRenderHandle() {
		const _selfThis = this;
		const renderNodesMap = new Map<string, IRenderNode>();
		// 去掉多余的提示信息
		d3.selectAll('title').remove()

		d3.selectAll('.node').each((item: any) => {
			try {
				const key = item.key;
				const nodeData = this.dataMap?.get(key)
				const currentColorTheme = nodeTypeThemeMap[nodeData?.node_type || ''] || ThemeColor[0]
				const box: any = d3.selectAll(`#${key} polygon`).datum();
				const tar = {
					renderInfo: item,
					renderId: key,
					data: nodeData,
					theme: currentColorTheme,
					id: key,
					x: box.center.x,
					y: box.center.y,
				};
				renderNodesMap.set(key, tar);

				d3.selectAll(`#${key} text[fill="#000000"]`).attr('type', `mainText`);

				if (nodeData?.node_type !== 'COLLECT') {
					d3.select(`#${key}`).attr('type', 'normal')
				} else {
					d3.select(`#${key}`).attr('type', 'collect')
				}
			} catch (error) {
				console.log(error);
			}

			// 调试位置坐标
			// d3.selectAll(`#${nodeId}`)
			// 	.append('g')
			// 	.append('text')
			// 	.text(`${box.attributes.x},${box.attributes.y}`)
			// 	.attr('fill', '#ff0000')
			// 	.attr('x', box.attributes.x)
			// 	.attr('y', box.attributes.y + 300);
		});

		this.renderNodesMap = renderNodesMap;

		this.beautifulNode()

		let tipsContent: JSX.Element;

		// d3.selectAll('.node')
		// 	.on('mouseenter', function (node: any, d: any) {
		// 		const key = node.key;
		// 		const curNode = _selfThis.dataMap?.get(Number(key));
		// 		tipsContent = (
		// 			<div>
		// 				<div className="pb12 d-f jc-b ac fs16">
		// 					<strong>详情</strong>
		// 				</div>
		// 				<div>{123}</div>
		// 			</div>
		// 		);
		// 		_selfThis.tip
		// 			.offset([0, 0])
		// 			.show(ReactDOMServer.renderToString(tipsContent), this);
		// 	})
		// 	.on('mouseleave', function (node: any, d: any) {
		// 		_selfThis.tip.hide();
		// 	});

		// d3.select('.d3-tip')
		// 	.on('mouseenter', function (node: any, d: any) {
		// 		_selfThis.tip.show(ReactDOMServer.renderToString(tipsContent));
		// 	})
		// 	.on('mouseleave', function (node: any, d: any) {
		// 		_selfThis.tip.hide();
		// 	});


		// 区分单双击事件
		let timeout: any = null;
		d3.selectAll('.node[type="collect"]')
			.on('click', function (node: any, d: any) {
				clearTimeout(timeout);

				timeout = setTimeout(function () {
					_selfThis.handleNodeClick && _selfThis.handleNodeClick(node)
				}, 200)
			}).on('dblclick', function (node: any, d: any) {
				clearTimeout(timeout);

				_selfThis.handleCollectExpand(node.key)

				const rootNode = _selfThis.dataMap?.get(_selfThis.rootNode?.key || '') as IPreHandleNode
				const preRenderData = _selfThis.preRenderDataReady(rootNode)
				_selfThis.renderNode(preRenderData).then(() => { })
			})

		const d3MainView = document.getElementById('d3MainView')
		if (d3MainView) {
			d3MainView.onclick = (e: any) => {
				let isNode = false
				for (let i = 0; i < e.path.length; i++) {
					const elem = e.path[i];
					if (elem.id && ~elem.id.indexOf('node_')) {
						isNode = true
						break
					}
				}
				if (!isNode) {
					_selfThis.refresh()
				}
			}
		}
	}

	public beautifulNode() {
		const _selfThis = this
		const boxs = d3.selectAll('.node polygon').data()

		boxs.forEach((item: any) => {
			const box = item.bbox
			const pid = item.parent.key
			const nodeData = this.dataMap?.get(pid)
			if (nodeData && nodeData.node_type !== 'COLLECT') {

				const currentColorTheme = nodeTypeThemeMap[nodeData.node_type] || ThemeColor[0]
				const currentStatus = nodeStatusMap[nodeData.status] || nodeStatusMap['U']
				const nodeIcon = NodeIconMap[nodeData.node_type]

				d3.select(`#${pid}`).remove()
				d3.select('#mainGroup')
					.append('g')
					.attr('id', pid)
					.attr('class', 'node')
					.attr('type', 'normal')
					.on('click', function (node: any, d: any) {
						const dataNode = _selfThis.renderNodesMap?.get(this.id)
						if (dataNode) {
							_selfThis.highlightRelation(dataNode)
						}
						_selfThis.handleNodeClick && _selfThis.handleNodeClick(dataNode?.data)
					})
					.append('rect')
					.attr('id', `rect_${pid}`)
					.attr('x', box.x)
					.attr('y', box.y)
					.attr('rx', box.height / 2)
					.attr('ry', box.height / 2)
					.attr('width', box.width)
					.attr('height', box.height)
					.attr('fill', '#fff')
					.attr('stroke', '#cdcdcd')
					.attr('stroke-width', 1)
					.attr('style', 'transition:all 0.3s;')

				d3.select(`#${pid}`)
					.append('path')
					.attr('d', `M${box.x} ${box.cy} L${box.x + box.width * 2 / 3} ${box.cy}`)
					.attr('stroke', '#cdcdcd')
					.attr('stroke-dasharray', '5,5')

				d3.select(`#${pid}`)
					.append('rect')
					.attr('class', 'rectBg')
					.attr('x', box.x)
					.attr('y', box.y)
					.attr('rx', box.height / 2)
					.attr('ry', box.height / 2)
					.attr('width', box.height)
					.attr('height', box.height)
					.attr('fill', currentColorTheme.color)

				d3.select(`#${pid}`)
					.append('rect')
					.attr('class', 'rectBg')
					.attr('id', `iconRect_${pid}`)
					.attr('x', box.x + box.height / 4)
					.attr('y', box.y)
					.attr('rx', box.height / 2)
					.attr('ry', box.height / 2)
					.attr('width', box.height / 2)
					.attr('height', box.height)
					.attr('fill', currentColorTheme.color)
					.attr('style', 'transition:all 0.3s;')

				d3.select(`#${pid}`)
					.append("svg:image")
					.attr('id', `icon_${pid}`)
					.attr("xlink:href", nodeIcon)
					.attr('width', box.height / 2)
					.attr('height', box.height / 2)
					.attr('x', box.x + box.height / 4)
					.attr('y', box.y + box.height * 0.23)

				if (nodeData.node_type === 'US' || nodeData.node_type === 'TDW') {
					d3.select(`#${pid}`)
						.append("svg:image")
						.attr("xlink:href", currentStatus.icon)
						.attr('width', box.height / 3)
						.attr('height', box.height / 3)
						.attr('x', box.x + box.width - box.height * 2 / 3)
						.attr('y', box.y + box.height * 0.2 / 2)
				} else {
					d3.select(`#${pid}`)
						.append("svg:image")
						.attr("xlink:href", nodeStatusMap['Y'].icon)
						.attr('width', box.height / 3)
						.attr('height', box.height / 3)
						.attr('x', box.x + box.width - box.height * 2 / 3)
						.attr('y', box.y + box.height * 0.2 / 2)
				}


				d3.select(`#${pid}`)
					.append('text')
					.text(nodeData.node_type)
					.attr('class', 'nodeType')
					.attr('x', box.x + box.height * 1.2)
					.attr('y', box.y + box.height * 0.75 / 2)
					.attr('width', box.height)
					.attr('height', box.height)
					.attr('font-weight', 'bold')
					.attr('fill', currentColorTheme.color)
				// .attr('text-anchor', 'start')
				// .attr('dominant-baseline', 'start')

				d3.select(`#${pid}`)
					.on("mouseover", function (d) {
						d3.select(`#rect_${pid}`).attr("stroke", currentColorTheme.color);
						d3.select(`#iconRect_${pid}`)
							.attr("rx", 0)
							.attr("ry", 0)
							.attr('x', box.x + box.height / 2);
					})
					.on("mouseout", function (d) {
						d3.select(`#rect_${pid}`).attr("stroke", "#cdcdcd");
						d3.select(`#iconRect_${pid}`)
							.attr('rx', box.height / 2)
							.attr('ry', box.height / 2)
							.attr('x', box.x + box.height / 4)
					})

				if (nodeData.node_type === 'SP_DASHBOARD') {
					d3.select(`#${pid}`)
						.append('a')
						.attr("xlink:href", `http://superset.tmeoa.com/superset/dashboard/${nodeData.node_id}`)
						.attr('target', '_bank')
						.append('text')
						.text(nodeData.node_id)
						.attr('class', 'nodeContent')
						.attr('x', box.x + box.height * 1.46)
						.attr('y', box.y + box.height * 0.8)
						.attr('width', box.height)
						.attr('height', box.height)
						.on("mouseover", function (d) {
							d3.select(this).attr("text-decoration", 'underline');
						})
						.on("mouseout", function (d) {
							d3.select(this).attr("text-decoration", 'none');
						})

					d3.select(`#${pid}`)
						.append("svg:image")
						.attr('id', `icon_${pid}`)
						.attr("xlink:href", require('../../images/link.svg').default)
						.attr('width', 16)
						.attr('height', 16)
						.attr('x', box.x + box.height * 1.2)
						.attr('y', box.y + box.height * 0.58)
				} else if (nodeData.node_type === 'SP_CHART') {
					d3.select(`#${pid}`)
						.append('a')
						.attr("xlink:href", `http://superset.tmeoa.com/superset/explore/?form_data=%7B%22slice_id%22%3A%20${nodeData.node_id}%7D`)
						.attr('target', '_bank')
						.append('text')
						.text(nodeData.node_id)
						.attr('class', 'nodeContent')
						.attr('x', box.x + box.height * 1.46)
						.attr('y', box.y + box.height * 0.8)
						.attr('width', box.height)
						.attr('height', box.height)
						.on("mouseover", function (d) {
							d3.select(this).attr("text-decoration", 'underline');
						})
						.on("mouseout", function (d) {
							d3.select(this).attr("text-decoration", 'none');
						})

					d3.select(`#${pid}`)
						.append("svg:image")
						.attr('id', `icon_${pid}`)
						.attr("xlink:href", require('../../images/link.svg').default)
						.attr('width', 16)
						.attr('height', 16)
						.attr('x', box.x + box.height * 1.2)
						.attr('y', box.y + box.height * 0.58)
				} else {
					d3.select(`#${pid}`)
						.append('text')
						.text(nodeData.node_id)
						.attr('class', 'nodeContent')
						.attr('x', box.x + box.height * 1.2)
						.attr('y', box.y + box.height * 0.8)
						.attr('width', box.height)
						.attr('height', box.height)
				}

			}
		})
	}

	public handleCollectExpand(nodeKey: string) {
		const currentNode = this.dataMap.get(nodeKey)
		const currentNodeInGraph = currentNode?.relativeKey
		const [tarParent] = currentNode?.parent || []
		const [tarChildren] = currentNode?.children || []
		const parentNode = tarParent && this.dataMap?.get(tarParent.key)
		const childrenNode = tarChildren && this.dataMap?.get(tarChildren.key)

		if (parentNode && currentNode && currentNodeInGraph === 'children') {
			const collection = parentNode.collectionChildren || []
			const children = parentNode.children || []
			const collectionTypeNode = parentNode.children.pop() as IPreHandleNode
			const targetNode = collection.shift()

			if (targetNode) {
				// 处理在节点collect里存在关系的情况
				this.nodesInCollectionMap.delete(targetNode.key)
				const nodesQuene = [...targetNode.children]
				while (nodesQuene.length) {
					const nodeItem = nodesQuene.shift()
					if (nodeItem) {
						this.nodesInCollectionMap.delete(nodeItem.key)
						nodesQuene.push(...(nodeItem.children || []))
					}
				}

				// 处理展开关系
				currentNode.collectNum = (currentNode.collectNum || 0) - 1
				currentNode.collectionNodes = collection
				parentNode.collectionChildren = collection
				if (collection.length) {
					parentNode.children = [...children, targetNode, collectionTypeNode]
				} else {
					parentNode.children = [...children, targetNode]
				}
			}
		}

		if (childrenNode && currentNode && currentNodeInGraph === 'parent') {
			const collection = childrenNode.collectionParent || []
			const parent = childrenNode.parent || []
			const collectionTypeNode = childrenNode.parent.pop() as IPreHandleNode
			const targetNode = collection.shift()

			if (targetNode) {
				// 处理在节点collect里存在关系的情况
				this.nodesInCollectionMap.delete(targetNode.key)
				const nodesQuene = [...targetNode.parent]
				while (nodesQuene.length) {
					const nodeItem = nodesQuene.shift()
					if (nodeItem) {
						this.nodesInCollectionMap.delete(nodeItem.key)
						nodesQuene.push(...(nodeItem.parent || []))
					}
				}

				// 处理展开关系
				currentNode.collectNum = (currentNode.collectNum || 0) - 1
				currentNode.collectionNodes = collection
				childrenNode.collectionParent = collection
				if (collection.length) {
					childrenNode.parent = [...parent, targetNode, collectionTypeNode]
				} else {
					childrenNode.parent = [...parent, targetNode]
				}
			}
		}
	}

	/**
	 * 渲染节点
	 * @param nodes
	 */
	public renderNode(nodes: IPreHandleNode[], isDisable?: boolean) {
		this.loadingStart && this.loadingStart()
		// console.log('nodes', nodes);
		// console.log('nodesInCollectionMap', this.nodesInCollectionMap);
		// console.log('nodesInGraphMap', this.nodesInGraphMap);

		const nodesRender = this.createRenderNodes(nodes, isDisable)
		const nodesRenderRelation = this.cerateRenderNodesRelation(nodes);
		const dotSrc = `digraph  {
			id=mainGroup;
			rankdir = LR;
			ranksep = 1;
			nodesep = 1;
			edge [color="#cdcdcd"];
			${nodesRender.join(' ')} ${nodesRenderRelation.join(' ')}
        }`;

		// console.log(dotSrc);
		const test = (d3.select('#gNode') as any)
			.graphviz({
				zoom: false,
				zoomTranslateExtent: [0, 0],
				// width: this.innerWidth,
				// height: this.innerHeight
			})
			.dot(dotSrc);
		// console.log('dot', test);
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				try {
					(d3.select('#gNode') as any)
						.graphviz({
							zoom: false,
							zoomTranslateExtent: [0, 0],
							// width: this.innerWidth,
							// height: this.innerHeight
						})
						.renderDot(dotSrc);
				} catch (error) {
					console.log(error);
				}

				// 后处理
				this.backRenderHandle()

				this.loadingEnd && this.loadingEnd()
				resolve('')
			}, 0)
		})
	}

	public highlightRelation(node: IRenderNode) {

		// 全局置灰
		d3.selectAll(`.node polygon`).attr('stroke', '#cdcdcd').attr('fill', '#ffffff');
		d3.selectAll(`.node text`).attr('fill', '#cdcdcd');
		d3.selectAll(`.node .rectBg`).attr('fill', '#cdcdcd');
		d3.selectAll(`.edge path`).attr('stroke', '#cdcdcd');
		d3.selectAll(`.edge polygon`).attr('stroke', '#cdcdcd').attr('fill', '#cdcdcd');

		const cutTreeNodeParent = this.treeCutNode([node.data], 'parent', 'key', this.rootNode?.key)
		const cutTreeNodeChildren = this.treeCutNode([node.data], 'children', 'key', this.rootNode?.key)
		const nodeParentList = this.tree2List(cutTreeNodeParent, 'parent')
		const nodeChildrenList = this.tree2List(cutTreeNodeChildren, 'children')

		console.log('nodeParentList', nodeParentList);

		for (let i = 0; i < nodeParentList.length; i++) {
			const item = nodeParentList[i];

			// 高亮节点
			if (item) {
				// d3.selectAll(`#${item.key} polygon`).attr('stroke', '#0078d4').attr('fill', '#ffffff');
				// d3.selectAll(`#${item.key} text`).attr('fill', '#0078d4');
				// d3.selectAll(`#${item.key} #rect_${item.key}`).attr('stroke', '#1e1653');
				const currentColorTheme = nodeTypeThemeMap[item.node_type] || ThemeColor[0]
				d3.selectAll(`#${item.key} .rectBg`).attr('fill', currentColorTheme.color);
				d3.selectAll(`#${item.key} .nodeType`).attr('fill', currentColorTheme.color);
				d3.selectAll(`#${item.key} .nodeContent`).attr('fill', '#000');
			}

			// 高亮边
			if (item && item.parent && item.parent.length) {
				for (let i = 0; i < item.parent.length; i++) {
					const par = item.parent[i];
					const edgeId = `edgePre_${par.key}_edge_${item.key}`;
					d3.selectAll(`#${edgeId} path`).attr('stroke', '#1e1653');
					d3.selectAll(`#${edgeId} polygon`).attr('stroke', '#1e1653').attr('fill', '#1e1653');
				}
			}
		}


		for (let i = 0; i < nodeChildrenList.length; i++) {
			const item = nodeChildrenList[i];
			if (item) {
				// d3.selectAll(`#${item.key} polygon`).attr('stroke', '#1e1653').attr('fill', '#ffffff');
				// d3.selectAll(`#${item.key} text`).attr('fill', '#1e1653');
				// d3.selectAll(`#${item.key} #rect_${item.key}`).attr('stroke', '#1e1653');
				const currentColorTheme = nodeTypeThemeMap[item.node_type] || ThemeColor[0]
				d3.selectAll(`#${item.key} .rectBg`).attr('fill', currentColorTheme.color);
				d3.selectAll(`#${item.key} .nodeType`).attr('fill', currentColorTheme.color);
				d3.selectAll(`#${item.key} .nodeContent`).attr('fill', '#000');
			}

			if (item && item.children && item.children.length) {
				for (let i = 0; i < item.children.length; i++) {
					const child = item.children[i];
					const edgeId = `edgePre_${item.key}_edge_${child.key}`;
					d3.selectAll(`#${edgeId} path`).attr('stroke', '#1e1653')
					d3.selectAll(`#${edgeId} polygon`).attr('stroke', '#1e1653').attr('fill', '#1e1653');
				}
			}
		}
	}

	public refresh() {
		const nodeParentList = this.tree2List([this.rootNode], 'parent')
		const nodeChildrenList = this.tree2List([this.rootNode], 'children')

		for (let i = 0; i < nodeParentList.length; i++) {
			const item = nodeParentList[i];
			if (item?.node_type === 'COLLECT') {
				d3.selectAll(`#${item.key} polygon`).attr('stroke', '#000000')
				d3.select(`#${item.key} text`).attr('fill', '#000000');
				continue
			}

			// 高亮节点
			if (item) {
				const currentColorTheme = nodeTypeThemeMap[item.node_type] || ThemeColor[0]
				d3.selectAll(`#${item.key} .rectBg`).attr('fill', currentColorTheme.color);
				d3.selectAll(`#${item.key} .nodeType`).attr('fill', currentColorTheme.color);
				d3.selectAll(`#${item.key} .nodeContent`).attr('fill', '#000');
			}


			// 高亮边
			if (item && item.parent && item.parent.length) {
				for (let i = 0; i < item.parent.length; i++) {
					const par = item.parent[i];
					const edgeId = `edgePre_${par.key}_edge_${item.key}`;
					d3.selectAll(`#${edgeId} path`).attr('stroke', '#cdcdcd');
					d3.selectAll(`#${edgeId} polygon`).attr('stroke', '#cdcdcd').attr('fill', '#cdcdcd');
				}
			}
		}

		for (let i = 0; i < nodeChildrenList.length; i++) {
			const item = nodeChildrenList[i];
			if (item?.node_type === 'COLLECT') {
				d3.selectAll(`#${item.key} polygon`).attr('stroke', '#000000')
				d3.select(`#${item.key} text`).attr('fill', '#000000');
				continue
			}

			if (item) {
				const currentColorTheme = nodeTypeThemeMap[item.node_type] || ThemeColor[0]
				d3.selectAll(`#${item.key} .rectBg`).attr('fill', currentColorTheme.color);
				d3.selectAll(`#${item.key} .nodeType`).attr('fill', currentColorTheme.color);
				d3.selectAll(`#${item.key} .nodeContent`).attr('fill', '#000');
			}

			if (item && item.children && item.children.length) {
				for (let i = 0; i < item.children.length; i++) {
					const child = item.children[i];
					const edgeId = `edgePre_${item.key}_edge_${child.key}`;
					d3.selectAll(`#${edgeId} path`).attr('stroke', '#cdcdcd')
					d3.selectAll(`#${edgeId} polygon`).attr('stroke', '#cdcdcd').attr('fill', '#cdcdcd');
				}
			}
		}
	}

	/**
	 *将某个节点移动到画布中间
	 *
	 * @param {(string)} id
	 * @memberof CostMap
	 */
	public anchorNode(id: string) {
		this.resetNode(this.activeNodeId || '');
		const graphvizDom: any = d3.select('#mainGroup').datum();
		const relativeY = graphvizDom.translation.y;

		const renderNode: any = this.renderNodesMap?.get(id);
		if (renderNode) {
			// pt转px
			const x = -renderNode.x * (96 / 72) + this.innerWidth / 2 - 200;
			// const y = renderNode.y * (96 / 72) - relativeY;
			const y = -(relativeY - -renderNode.y) * (96 / 72) + this.innerHeight / 2;
			this.mainView.call(this.zoom.transform, d3.zoomIdentity.translate(x, y).scale(1));
		}
		this.activeNode(id);
	}

	public activeNode(id: string) {
		const renderNode = this.renderNodesMap?.get(id);
		const dataNode = this.dataMap?.get(id);
		if (this.activeNodeId) {
			d3.selectAll(`#${this.activeNodeId} .nodeContent`).attr('fill', '#000');
		}
		if (renderNode && dataNode) {
			this.activeNodeId = id;
			d3.selectAll(`#${id} .nodeContent`).attr('fill', ThemeColor[dataNode.level % 5].activeColor || '');
			// console.log(d3.selectAll(`#${renderNode.renderId} text[fill="#000000"]`));
			// d3.selectAll(`#${renderNode.renderId} text`).attr('fill', ThemeColor[dataNode.level % 5].activeColor || '');
			// d3.selectAll(`#${renderNode.renderId} path`)
			// 	// .attr('fill', ThemeColor[dataNode.level].activeColor || '')
			// 	.attr('stroke', ThemeColor[dataNode.level].activeColor || '');
			// d3.selectAll(`#${renderNode.renderId} polyline`).attr(
			// 	'stroke',
			// 	ThemeColor[dataNode.level].activeColor || '',
			// );
		}
	}

	public resetNode(id: string) {
		const renderNode = this.renderNodesMap?.get(id);
		const dataNode = this.dataMap?.get(id);
		if (renderNode && dataNode) {
			d3.selectAll(`[node_id=value${renderNode.renderId}]`).attr('fill', '#000000');
			// d3.selectAll(`#${renderNode.renderId} text`).attr('fill', ThemeColor[dataNode.level % 5].color);
			// d3.selectAll(`#${renderNode.renderId} path`)
			// 	// .attr('fill', ThemeColor[dataNode.level % 5].background)
			// 	.attr('stroke', ThemeColor[dataNode.level % 5].border);
			// d3.selectAll(`#${renderNode.renderId} polyline`).attr('stroke', ThemeColor[dataNode.level % 5].border);
		}
	}
}
