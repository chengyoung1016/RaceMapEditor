import PointsData from "../data/PointsData";
import PointController from "../ui/PointController";
import MapData from "../data/MapData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MapEditor extends cc.Component {
    @property(cc.Prefab)
    pointPrefab: cc.Prefab = null;
    @property(cc.Node)
    root: cc.Node = null;
    @property(cc.Camera)
    camera: cc.Camera = null;
    @property(cc.Node)
    pointsRoot: cc.Node = null;
    @property(cc.Graphics)
    graphics: cc.Graphics = null;

    //用来绘制添加的新节点的线
    prePoint: cc.Node = null;
    curPoint: cc.Node = null;
    //地图总长度
    mapLength: number = 0;

    //当前节点id
    curPointIdx: number = 0;

    selectPointId: number = -1;

    private static _instance: MapEditor;
    public static get instance(): MapEditor {
        return this._instance;
    }

    onLoad() {
        MapEditor._instance = this;
        MapData.getInstance();
        this.graphicsInit();
        this.init();
    }

    init() {
        this.curPoint = null;
        this.prePoint = null;
        this.curPointIdx = 0;
        this.mapLength = 0;
        this.graphics.clear();
        this.pointsRoot.destroyAllChildren();
    }

    //graphics初始化
    graphicsInit() {
        let g = this.graphics;
        g.lineWidth = 3;
        g.fillColor = cc.color(255, 255, 0);
    }

    //绘制一条线
    graphicsLine() {
        if(this.prePoint != null) {
            this.graphics.moveTo(this.prePoint.x, this.prePoint.y);
            this.graphics.lineTo(this.curPoint.x, this.curPoint.y);
            this.graphics.stroke();
        }
    }

    //绘制所有节点的连线
    graphicsAllLine() {
        //绘制前清除所有连线
        let points = MapData.getInstance().getAllPointPos();
        let len = points.length;
        this.graphics.clear();
        for(let i = 0; i < len; i++) {
            this.graphics.moveTo(points[i].x, points[i].y);
            let next = points[i + 1];
            if(next) {
                this.graphics.lineTo(next.x, next.y);
                this.graphics.stroke();
            }
        }
        this.selectPointId == -1;
    }

    //添加一个点
    addPoint(pos: cc.Vec2) {
        let x = parseFloat(pos.x.toFixed(2)) ;
        let y = parseFloat(pos.y.toFixed(2));
        let instance = cc.instantiate(this.pointPrefab);
        let pc = instance.getComponent('PointController') as PointController;
        instance.setPosition(cc.v2(x, y));
        this.pointsRoot.addChild(instance);
        //设置节点id，
        pc.pointId = this.curPointIdx;
        this.curPoint = instance;
        //将节点放入mapdata
        MapData.getInstance().setPoint(pc.pointId, instance);
        for(let i = this.curPointIdx - 1; i >= 0; i--) {
            let point = MapData.getInstance().getPoint(i)
            if(point != null) {
                this.prePoint = point;
                break;
            }   
        }
        //更新节点id
        this.curPointIdx++;
        //绘制两个节点之间的连线  此时只需要绘制最新的点的连线即可
        this.graphicsLine();
    }

    update(dt) {
        let points = MapData.getInstance().getAllPointPos();
        let len = points.length;
        if(len <= 1) {
            this.mapLength = 0;
            return;
        }

        this.caluteMapLenth(points, len);
    }

    //计算地图总长度
    caluteMapLenth(points: cc.Vec2[], len: number) {
        let everyPointDis = [];
        for(let i = 0 ; i < len; i++) {
            let nextP = points[i + 1];
            if(nextP) {
                let v = nextP.sub(points[i]);
                let dis = Math.abs(v.mag());
                everyPointDis.push(dis);
            }
        }

        //计算地图总长度
        this.mapLength = everyPointDis.reduce((total, current) => {
            return total + current;
        })
    }

    
}
