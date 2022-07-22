import {
	DownloadOutlined,
	DownOutlined,
	FullscreenExitOutlined,
	FullscreenOutlined,
	LeftOutlined,
	QuestionCircleOutlined,
	ReloadOutlined,
	RightOutlined,
} from '@ant-design/icons';
import { Button, Col, Drawer, Dropdown, Input, Menu, Row, Select, Spin, Tag, Tooltip } from 'antd';
import { LabeledValue } from 'antd/lib/select';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getBloodRelation, getBloodRelationCSVData, getBloodRelationDetail, getBloodRelationListData, getNodeListByNodeId } from '../../api/bloodRelationApi';
import { IBloodRelationNode, TBloodRelationNodeType } from '../../api/interface/bloodRelationInterface';
import DataDiscoverySearch, { IOptionsGroupItem } from '../../components/DataDiscoverySearch/DataDiscoverySearch';
import Guide from '../../components/Guide/Guide';
import InputSearch from '../../components/InputSearch/InputSearch';
import Loading from '../../components/Loading/Loading';
import TableBox from '../../components/TableBox/TableBox';
import { getParam, saveJSON } from '../../util';
import NodeDetail, { INodeDetailItem } from './NodeDetail';
import RelationDiagram from './RelationDiagram';
// import { getBloodRelation2 } from '../../api/apiList';

interface IProps {
	id?: string | number | undefined | null;
	isCollapsed?: boolean;
}

export default function BloodRelation2(props: IProps) {
	const [searchValue, setSearchValue] = useState('');
	const [searchIndex, setSearchIndex] = useState(0);
	const [searchTotal, setSearchTotal] = useState(0);
	const [searchRes, setSearchRes] = useState<string[]>([]);
	const [isFullSreen, setIsFullSreen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [loadingSearch, setLoadingSearch] = useState(false);
	const [preNodeCount, setPreNodeCount] = useState(2);
	const [nextNodeCount, setNextNodeCount] = useState(2);
	// const [relationDiagram, setRelationDiagram] = useState<RelationDiagram>();
	const [nodeNameList, setNodeNameList] = useState<string[]>([]);
	const [visableDrawer, setVisableDrawer] = useState(false)
	const [visableDrawerCollect, setVisableDrawerCollect] = useState(false)
	const [dataListCollectNode, setDataListCollectNode] = useState<any[]>([])
	const [nodeType, setNodeType] = useState<TBloodRelationNodeType>(getParam('nodeType') as TBloodRelationNodeType || 'TDW')
	const [nodeId, setNodeId] = useState<string>(getParam('nodeId') || '')
	const [isNoData, setIsNoData] = useState(false)
	const [nodeDetail, setNodeDetail] = useState<INodeDetailItem[]>([])
	const [loadingDetail, setLoadingDetail] = useState(false)
	const [dataSearchOptions, setDataSearchOptions] = useState<IOptionsGroupItem[]>([])

	const treeDataRef = useRef<IBloodRelationNode[]>()

	const [relationDiagram, _setRelationDiagram] = useState<RelationDiagram>();
	const relationDiagramRef = useRef(relationDiagram);
	const setRelationDiagram = (data: RelationDiagram): void => {
		relationDiagramRef.current = data;
		_setRelationDiagram(data);
	};

	useEffect(() => {
		const target = new RelationDiagram({
			containerId: 'd3Container',
			mainViewId: 'd3MainView',
			margin: 16,
		});
		setRelationDiagram(target);

		const resizeIframe = document.getElementById('resizeIframe') as HTMLIFrameElement;
		if (resizeIframe.contentWindow) {
			resizeIframe.contentWindow.onresize = () => {
				setTimeout(() => {
					console.log(relationDiagramRef.current);
					relationDiagramRef.current?.reSize();
				}, 1000);
			};
		}
	}, []);

	useEffect(() => {
		fetchBloodRelationData({
			preCount: preNodeCount,
			nextCount: nextNodeCount,
			currentNodeId: nodeId,
			currentNodeType: nodeType
		});
	}, [relationDiagram, preNodeCount, nextNodeCount]);

	const handleClickNode = (node: any) => {
		const currentNode = relationDiagram && relationDiagram.dataMap && relationDiagram.dataMap.get(node.key)
		console.log('currentNode', currentNode);
		if (currentNode?.node_type === 'COLLECT') {
			setDataListCollectNode([])
			setVisableDrawerCollect(true)
			const collection = currentNode.collectionNodes
			console.log(collection);
			setDataListCollectNode(collection || [])
		} else {
			setNodeDetail([])
			setLoadingDetail(true)
			setVisableDrawer(true)
			getBloodRelationDetail({
				nodeId: currentNode?.node_id || '',
				nodeType: currentNode?.node_type || 'US'
			}).then(res => {
				const { data } = res.data.data.tab_meta.details[0];
				const detail: INodeDetailItem[] = data.map(item => {
					const { cn } = item
					const res = {
						...item,
						label: cn,
					}
					return res
				})
				setNodeDetail(detail)
				setLoadingDetail(false)
			}).catch(() => {
				setLoadingDetail(false)
			})
		}
	}

	const fetchBloodRelationData = ({ preCount, nextCount, currentNodeId, currentNodeType }: {
		preCount: number
		nextCount: number
		currentNodeId: string
		currentNodeType: TBloodRelationNodeType
	} = { preCount: preNodeCount, nextCount: nextNodeCount, currentNodeId: nodeId, currentNodeType: nodeType }) => {

		if (relationDiagram) {
			if (!!currentNodeId) {
				setLoading(true);
				getBloodRelation({
					nodeId: currentNodeId.trim(),
					nodeType: currentNodeType,
					depthParent: preCount,
					depthChildren: nextCount
				})
					.then((res) => {
						const tarRes = res.data.data.blood || []
						treeDataRef.current = tarRes

						if (!tarRes.length) {
							setIsNoData(true)
						} else {
							setIsNoData(false)
						}
						relationDiagram.initData(tarRes);
						relationDiagram.handleNodeClick = handleClickNode;
						relationDiagram.loadingStart = () => {
							setLoading(true)
						}
						relationDiagram.loadingEnd = () => {
							setLoading(false)
						}
						const nameList = relationDiagram.dataNodes.map((item) => item.node_name)
						// console.log(nameList)
						setNodeNameList(nameList);
					})
					.catch((err) => {
						console.log(err);
						setIsNoData(true)
					})
					.finally(() => {
						// setLoading(false);
					});
			} else {
				relationDiagram.initData([])
				setIsNoData(true)
			}

		}
	};

	const handleSearchChange = (value: string) => {
		// console.log(nodeNameList);
		const searchList: string[] = nodeNameList.filter((item) => item.indexOf(value) !== -1);
		setSearchRes(searchList);
		setSearchIndex(0);
		setSearchTotal(searchList.length);
		setSearchValue(value);
		if (searchList.length && relationDiagram && relationDiagram.dataMapByName) {
			const currentName = searchList[0];
			const node: any = relationDiagram.dataMapByName.get(currentName);
			node && relationDiagram.anchorNode(node['key']);
		}
	};

	const handleClickSearchPre = () => {
		const current = searchIndex - 1;
		if (current >= 0) {
			setSearchIndex(current);
			if (searchRes.length && relationDiagram && relationDiagram.dataMapByName) {
				const currentName = searchRes[current];
				const node: any = relationDiagram.dataMapByName.get(currentName);
				node && relationDiagram.anchorNode(node['key']);
			}
		}
	};

	const handleClickSearchNext = () => {
		const current = searchIndex + 1;
		if (current <= searchTotal - 1) {
			setSearchIndex(current);
			if (searchRes.length && relationDiagram && relationDiagram.dataMapByName) {
				const currentName = searchRes[current];
				const node: any = relationDiagram.dataMapByName.get(currentName);
				console.log(currentName, node);
				node && relationDiagram.anchorNode(node['key']);
			}
		}
	};

	// 全屏
	const fullScreen = () => {
		const element: any = document.getElementById('fullContainer');
		const doc: any = document;
		const isFullscreen = doc.fullScreen || doc.mozFullScreen || doc.webkitIsFullScreen;
		if (!isFullscreen && element) {
			(element.requestFullscreen && element.requestFullscreen()) ||
				(element.mozRequestFullScreen && element.mozRequestFullScreen()) ||
				(element.webkitRequestFullscreen && element.webkitRequestFullscreen()) ||
				(element.msRequestFullscreen && element.msRequestFullscreen());
		} else {
			// eslint-disable-next-line @typescript-eslint/no-unused-expressions
			doc.exitFullscreen
				? doc.exitFullscreen()
				: doc.mozCancelFullScreen
					? doc.mozCancelFullScreen()
					: doc.webkitExitFullscreen
						? doc.webkitExitFullscreen()
						: '';
		}
	};

	return (
		<div className="p-r h100" id="fullContainer">
			{
				!isNoData ? <Guide containerId='fullContainer' option={[
					{
						maskType: 'rect',
						tipPosition: 'bottom',
						tipAlign: 'left',
						maskDisplay: true,
						content: <div>选择表类型，输入搜索血缘关系，例如：库名::表名。</div>,
						targetId: 'bloodRelationSeatch',
					},
					{
						maskType: 'rect',
						tipPosition: 'bottom',
						tipAlign: 'left',
						maskDisplay: true,
						content: <div>可以很方便的在血缘关系图中搜索相关节点，按<span className="c-theme plr4">Enter</span>可自动探索下一个。</div>,
						targetId: 'bloodRelationSearchIn',
					},
					{
						maskType: 'rect',
						tipPosition: 'bottom',
						tipAlign: 'right',
						maskDisplay: true,
						content: <div>选择所要探索中心点的上下游层数。</div>,
						targetId: 'bloodRelationSearchPreNext',
					},
					{
						maskType: 'rect',
						tipPosition: 'bottom',
						tipAlign: 'center',
						maskDisplay: true,
						content: <div>点击节点可查看详情，鼠标<span className="c-theme plr4">滚轮</span>或<span className="c-theme plr4">触控板</span>可操作关系图的放大缩小，按住鼠标<span className="c-theme plr4">拖拽</span>可查看关系图的剩余部分。</div>,
						targetId: `node_${relationDiagram?.rootNode?.key || ''}`,
					}
				]}
					onFinish={() => {
						localStorage.setItem('bloodRelationGuide', 'true')
					}}
					isClose={true || Boolean(localStorage.getItem('bloodRelationGuide'))} /> : null
			}
			<iframe
				id="resizeIframe"
				src=""
				frameBorder="0"
				className="p-a z-1"
				style={{ width: '100%', height: '100%' }}
			/>
			{
				loading ? <div className="p-a w100 h100 d-f ac jc mark z999 fadein">
					<Spin spinning={loading} indicator={<Loading />}>
						<div />
					</Spin>
				</div> : null
			}
			<Drawer
				title="节点详情"
				width={800}
				closable={false}
				onClose={() => { setVisableDrawer(false) }}
				visible={visableDrawer}
			>
				<Spin spinning={loadingDetail}>
					<NodeDetail data={nodeDetail} />
				</Spin>
			</Drawer>

			<Drawer
				title="聚合节点详情"
				width={700}
				closable={false}
				onClose={() => { setVisableDrawerCollect(false) }}
				visible={visableDrawerCollect}
			>
				<TableBox
					cancelExportData={true}
					rowKey={(record: any) => {
						return record.key
					}}
					columns={[
						{
							title: '节点类型',
							dataIndex: 'node_type',
							key: 'node_type',
							width: 150
						},
						{
							title: '节点ID',
							dataIndex: 'node_id',
							key: 'node_id',
							width: 150
						}
					]}
					pagination={false}
					dataSource={dataListCollectNode}
				/>
			</Drawer>

			<div className="p16 z1 d-f at jc-b p-a w100 z9" style={{ top: 0, right: 0 }}>
				<div id="bloodRelationSeatch">
					<DataDiscoverySearch
						width={'500px'}
						maxHeight={500}
						placeholder="输入关键字"
						value={nodeId}
						loading={loadingSearch}
						options={dataSearchOptions}
						onClick={(value, option: any) => {
							fetchBloodRelationData({
								currentNodeId: value,
								currentNodeType: option.nodeType,
								preCount: preNodeCount,
								nextCount: nextNodeCount
							})
							setNodeId(option.value)
							setNodeType(option.nodeType)
						}}
						onChange={(value) => {
							setNodeId(value)
						}}
						onSearch={(value) => {
							console.log(value)
							setLoadingSearch(true)
							getNodeListByNodeId(nodeId).then(res => {
								console.log(res.data)
								const data = res.data.data
								const tarRes: IOptionsGroupItem[] =
									Object.entries(data)
										.reduce((pre: any, [key, value]) => ([...pre, { name: key, option: value.map(item => ({ label: item.toString(), value: item.toString(), nodeType: key })) }]), [])
								setDataSearchOptions(tarRes)
							}).finally(() => {
								setLoadingSearch(false)
							})
						}}
					/>
					<div className="mt8"><Tag color="geekblue">输入关键字（表名/任务ID/DashboardId/ChartId）搜索相关节点，如 qqmusic_rec</Tag></div>
					{/* <Input.Group compact>
						<Select defaultValue={nodeType}
							dropdownMatchSelectWidth={200}
							onChange={(value: any) => {
								setNodeType(value)
							}}
							options={[
								{ label: 'TDW', value: "TDW" },
								{ label: 'CK', value: "CK" },
								{ label: 'US', value: "US" },
								{ label: 'VENUS', value: "VENUS" },
								{ label: 'TDBANK', value: "TDBANK" },
								{ label: 'TESLA', value: "TESLA" },
								{ label: 'SP_DASHBOARD', value: "SP_DASHBOARD" },
								{ label: 'SP_CHART', value: "SP_CHART" },
								{ label: 'LP', value: "LP" },
							]} />
						<div>
							<Input.Search loading={loading} style={{ width: 500 }} placeholder="输入搜索血缘关系" enterButton
								value={nodeId}
								onChange={(e) => {
									setNodeId(e.target.value)
								}}
								onSearch={() => {
									fetchBloodRelationData()
								}}
								onPressEnter={() => {
									fetchBloodRelationData()
								}} />
							<div className="mt8"><Tag color="geekblue">输入格式规范：库名::表名，如 qqmusic_rec::history_music_listen_record_all</Tag></div>
						</div>
					</Input.Group> */}
				</div>
				<div className="d-f ac">
					<div className="mr16">
						{/* <Button type="primary" onClick={() => { 
							relationDiagram?.refresh()
						}}><ReloadOutlined />恢复</Button> */}
						<Dropdown overlay={<Menu>
							<Menu.Item onClick={() => {
								saveJSON(treeDataRef.current, 'treeData.json')
							}}>
								<span className="link">
									树形数据结构 <DownloadOutlined />
								</span>
							</Menu.Item>
							<Menu.Item onClick={() => {
								getBloodRelationListData({
									nodeId: nodeId.trim(),
									nodeType,
									depthParent: preNodeCount,
									depthChildren: nextNodeCount
								}).then(res => {
									const data = res.data.data
									saveJSON(data, 'listData.json')
								})
							}}>
								<span className="link" >
									列表数据结构 <DownloadOutlined />
								</span>
							</Menu.Item>
							<Menu.Item onClick={() => {
								window.open(`/api/dataServices/metadata/exploreMetadataBloodA2BCsv?nodeId=${nodeId.trim()}&nodeType=${nodeType}&depthParent=${preNodeCount}&depthChildren=${nextNodeCount}`, 'bank')
							}}>
								<span className="link">
									CSV格式数据 <DownloadOutlined />
								</span>
							</Menu.Item>
						</Menu>}>
							<Button>下载数据 <DownOutlined /></Button>
						</Dropdown>
					</div>

					<div className="mr16" id="bloodRelationSearchIn">
						<Input
							value={searchValue}
							onChange={(e) => handleSearchChange(e.target.value)}
							onPressEnter={(e) => {
								handleClickSearchNext()
							}}
							addonAfter={
								<div>
									<LeftOutlined className="pr4" onClick={handleClickSearchPre} />
									<RightOutlined className="pl4" onClick={handleClickSearchNext} />
								</div>
							}
							placeholder="输入关键字搜索图中节点"
							suffix={`${searchTotal ? searchIndex + 1 : 0}/${searchTotal}`}
						/>
					</div>

					<div id="bloodRelationSearchPreNext" className="d-f">
						<div className="d-f ac mr16">
							<div className="tag-gray pr8">
								<span className="pr8">上游</span>
								<Tooltip
									getPopupContainer={() => document.getElementById('fullContainer') || document.body}
									placement="bottom"
									title={<span>目前上游最多展示6层</span>}
								>
									<QuestionCircleOutlined />
								</Tooltip>
							</div>
							<Select
								getPopupContainer={() => document.getElementById('fullContainer') || document.body}
								defaultValue={2}
								style={{ width: 80 }}
								onChange={(value) => {
									setPreNodeCount(value);
									setSearchIndex(0);
									setSearchRes([]);
									setSearchTotal(0);
									setSearchValue('');
								}}
								options={[
									{ label: '1层', value: 1 },
									{ label: '2层', value: 2 },
									{ label: '3层', value: 3 },
									{ label: '4层', value: 4 },
									{ label: '5层', value: 5 },
									{ label: '6层', value: 6 },
								]}
							/>
						</div>

						<div className="d-f ac">
							<div className="tag-gray pr8">
								<span className="pr8">下游</span>
								<Tooltip
									getPopupContainer={() => document.getElementById('fullContainer') || document.body}
									placement="bottom"
									title={<span>目前下游最多展示6层</span>}
								>
									<QuestionCircleOutlined />
								</Tooltip>
							</div>
							<Select
								getPopupContainer={() => document.getElementById('fullContainer') || document.body}
								defaultValue={2}
								onChange={(value) => {
									setNextNodeCount(value);
									setSearchIndex(0);
									setSearchRes([]);
									setSearchTotal(0);
									setSearchValue('');
								}}
								style={{ width: 80 }}
								options={[
									{ label: '1层', value: 1 },
									{ label: '2层', value: 2 },
									{ label: '3层', value: 3 },
									{ label: '4层', value: 4 },
									{ label: '5层', value: 5 },
									{ label: '6层', value: 6 },
								]}
							/>
						</div>
					</div>

					{/* <div className="ml16">
						{isFullSreen ? (
							<FullscreenExitOutlined
								style={{ fontSize: 24, marginLeft: 8, cursor: 'pointer' }}
								onClick={() => {
									fullScreen();
									setIsFullSreen(false);
								}}
							/>
						) : (
								<FullscreenOutlined
									style={{ fontSize: 24, marginLeft: 8, cursor: 'pointer' }}
									onClick={() => {
										fullScreen();
										setIsFullSreen(true);
									}}
								/>
							)}
					</div> */}
				</div>
			</div>
			{
				isNoData ? <div className="p-a w100 h100 d-f ac jc ta-c z1">
					<div>
						<div><img className="w320" src={require('../../images/workData.png')} alt="" /></div>
						<div className="fs22">暂无数据，可输入关键字（表名/任务ID/DashboardId/ChartId）搜索相关节点</div>
					</div>
				</div> : null
			}
			<div id="d3Container">
				<svg id="d3MainView" />
			</div>
		</div>
	);
}
