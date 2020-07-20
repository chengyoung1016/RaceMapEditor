import Singleton from "../utils/Singleton";
import MapEditor from "../editor/MapEditor";

/**
 * 地图数据类
 */
export default class MapData extends Singleton{
    //地图名字
    private _mapName: string = "";
    public get mapName(): string {
        return this._mapName;
    }
    public set mapName(value: string) {
        this._mapName = value;
    }

    //地图赛道宽度
    private _trackWidth: number = 0;
    public get trackWidth(): number {
        return this._trackWidth;
    }
    public set trackWidth(val: number) {
        this._trackWidth = val;
    }

    //地图上所有点的坐标cc.v2
    // public pointsPos: cc.Vec2[] = [];
    public getAllPointPos(): cc.Vec2[] {
        let pointsPos = [];
        for(let key in this.pointNodes) {
            let pos = this.pointNodes[key].position;
            pointsPos.push(cc.v2(pos.x, pos.y));
        }
        return pointsPos;
    }

    //地图上的所有点cc.Node
    public pointNodes: {[id: number]: cc.Node} = {}
    public getPoint(id: number): cc.Node {
        if(this.pointNodes[id]) {
            return this.pointNodes[id];
        }
        return null;
    }
    public setPoint(id: number, node: cc.Node) {
        this.pointNodes[id] = node;
    }

    constructor() {
        super();
        this.init();
    }

    /**
     * 需要导出的数据
     */
    getMapData() {
        return {mapName: this.mapName, trackWidth: this.trackWidth, points: this.getAllPointPos()};
    }

    //初始化
    init() {
        this.mapName = "";
        this.trackWidth = 0;
        this.pointNodes = {};
    }

    //节点位置改变了 需要重新绘制连线
    changePoint() {
        MapEditor.instance.graphicsAllLine();
    }

    /**
     * 删除某个节点
     * @param idx 节点索引
     */
    deletePoint(idx: number) {
        let target = this.getPoint(idx)
        if(target) {
            target.destroy();
            delete this.pointNodes[idx];
            MapEditor.instance.graphicsAllLine();
        }
    }

    /**
     * 删除所有节点
     */
    deleteAllPoints() {
        this.pointNodes = {};
        MapEditor.instance.init();
    }

    /**
     * 预览
     */
    previewCar() {

    }
}