import MapEditor from "../editor/MapEditor";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CameraCtrl extends cc.Component {
    @property(cc.Float)
    dragSpeed: number = 1;
    @property(MapEditor)
    mapEditor: MapEditor = null;
    @property(cc.Float)
    zoomStep: number = 0.1;
    @property(cc.Float)
    zoomMin: number = 0.5;
    @property(cc.Float)
    zoomMax: number = 2;

    cam: cc.Camera = null;
    
    private _enableDrag: boolean = true;
    private _isMoving = false;

    onLoad() {
        this.cam = this.getComponent(cc.Camera);
    }

    start () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);

        this.node.on(cc.Node.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
    }

    onMouseWheel(e: cc.Event.EventMouse) {
        let y = e.getScrollY();
        if(y > 0) {
            this.zoomTo(this.zoomStep);
        }
        if(y < 0) {
            this.zoomTo(-this.zoomStep);
        }
    }

    zoomTo(target: number) {
        this.cam.zoomRatio = this.clampZoom(this.cam.zoomRatio + target);
    }

    clampZoom(checkRatio: number): number {
        return cc.misc.clampf(checkRatio, this.zoomMin, this.zoomMax);
    }

    onTouchStart(e: cc.Event.EventTouch) {
        this._isMoving = false;
    }

    onTouchMove(e: cc.Event.EventTouch) {
        if(!this._enableDrag) {
            return;
        }
        this._isMoving = true;
        let x = -e.getDeltaX() * this.dragSpeed;
        let y = -e.getDeltaY() * this.dragSpeed;

        let targetX = this.cam.node.position.x + x;
        let targetY = this.cam.node.position.y + y;
        this.node.setPosition(targetX, targetY);
    }

    onTouchEnd(e: cc.Event.EventTouch) {
        if(this._isMoving) {
            this._isMoving = false;
            return;
        }
        let location = e.getLocation();
        let worldPos = this.cam.getScreenToWorldPoint(location);
        let pos = this.mapEditor.node.convertToNodeSpaceAR(worldPos);
        // console.log("real pos: (", pos.x + "," + pos.y + ")");
        this.mapEditor.addPoint(cc.v2(pos.x, pos.y));
    }

    onTouchCancel() {

    }

    // update (dt) {}
}
