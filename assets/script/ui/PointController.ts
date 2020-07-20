import MapData from "../data/MapData";
import MapEditor from "../editor/MapEditor";

const {ccclass, property} = cc._decorator;

const enum EMouseType {
    left = 0,
    right = 2
}

@ccclass
export default class PointController extends cc.Component {
    @property(cc.Label)
    posLabel: cc.Label = null;

    originPos: cc.Vec3 = null;
    pointId: number = null;

    private _isMoving: boolean = false;
    private _mouseType: EMouseType = 0;

    start () {
        this.posLabel.node.active = false;
        this.originPos = this.node.position;
        this.posLabel.string = "(" + this.node.position.x + "," + this.node.position.y + ")";
        this.registerEvent();
    }

    registerEvent() {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
        this.node.on(cc.Node.EventType.MOUSE_UP, this.onMouseUp, this);
    }

    onMouseDown(e: cc.Event.EventMouse) {
        this._isMoving = false;
        let btn = e.getButton();
        this._mouseType = btn;
    }

    onTouchMove(e: cc.Event.EventTouch) {
        this._isMoving = true;
        let delta = e.getDelta();
        let x = (this.node.x + delta.x).toFixed(2);
        let y = (this.node.y + delta.y).toFixed(2);
        this.node.x = parseFloat(x);
        this.node.y = parseFloat(y);
    }

    onMouseUp(e: cc.Event.EventMouse) {
        switch(this._mouseType) {
            case EMouseType.left:
                MapEditor.instance.selectPointId = this.pointId;
                if(this._isMoving) {
                    //某个点移动后 需要重新绘制所有线  暂时没有想到只更新改变的点的连线的方法
                    MapData.getInstance().changePoint();
                    this._isMoving = false;
                } else {
                    this.onPointClick();
                }
                break;
            case EMouseType.right:
                MapData.getInstance().deletePoint(this.pointId);
                break;
        }
        
        
        //console.log("after move point pos:", n.position.x, n.position.y, this.originPos.x, this.originPos.y);
    }

    onPointClick() {
        this.posLabel.string = "(" + this.node.position.x + "," + this.node.position.y + ")";
        this.posLabel.node.active = !this.posLabel.node.active;
    }

    // update (dt) {}
}
