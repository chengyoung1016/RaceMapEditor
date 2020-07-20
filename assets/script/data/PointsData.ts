import Singleton from "../utils/Singleton";

export default class PointsData extends Singleton{
    points: {[id: number]: cc.Node} = {}
    prePoint: cc.Node = null;
    curPoint: cc.Node = null;

    constructor() {
        super();
        this.points = [];
        this.prePoint = null;
        this.curPoint = null;
    }
}