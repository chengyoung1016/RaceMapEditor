import PointsData from "../data/PointsData";
import MapEditor from "../editor/MapEditor";
import MapData from "../data/MapData";


const {ccclass, property} = cc._decorator;

@ccclass
export default class UIController extends cc.Component {
    @property(MapEditor)
    mapEditor: MapEditor = null;
    @property(cc.Label)
    mapLength: cc.Label = null;

    @property(cc.EditBox)
    mapName: cc.EditBox = null;
    @property(cc.EditBox)
    trickWidth: cc.EditBox = null;
    @property(cc.EditBox)
    pointPos: cc.EditBox = null;

    /**
     * 导出地图信息
     */
    onExportMapData() {
        let data = MapData.getInstance().getMapData();
        let mapData = JSON.stringify(data);
        let textFileAsBlobMapData = new Blob([mapData], {type:'application/json'});
        let fileNameToSaveAsMapData = 'mapData.json';
        let downloadLinkMapData = document.createElement("a");
        downloadLinkMapData.download = fileNameToSaveAsMapData;
        downloadLinkMapData.innerHTML = "Download File";
        if(window.webkitURL != null) 
        {
            downloadLinkMapData.href = window.webkitURL.createObjectURL(textFileAsBlobMapData);
        }
        else
        {
            downloadLinkMapData.href = window.URL.createObjectURL(textFileAsBlobMapData);
            downloadLinkMapData.onclick = function() {
                console.log("11");
            };
            downloadLinkMapData.style.display = "none";
            document.body.appendChild(downloadLinkMapData);
        }
        downloadLinkMapData.click();
    }

    /**
     * 只清除地图上的点，还保存地图名字，宽度等
     */
    onClearMapData() {
        MapData.getInstance().deleteAllPoints();
    }

    /**
     * 删除整个地图数据
     */
    onDeleteMapData() {
        this.mapEditor.pointsRoot.destroyAllChildren();
        MapData.getInstance().init();
    }

    editMapNameEnded() {
        MapData.getInstance().mapName = this.mapName.string;
    }

    editTrickWidthEnded() {
        MapData.getInstance().trackWidth = parseInt(this.trickWidth.string);
    }

    editPointPosEntered() {
        if(MapEditor.instance.selectPointId == -1) {return;}
        let point = MapData.getInstance().getPoint(MapEditor.instance.selectPointId);
        let pos = this.pointPos.string.split(",");
        point.x = parseFloat(pos[0]);
        point.y = parseFloat(pos[1]);
        MapData.getInstance().changePoint();
    }

    update() {
        this.mapLength.string = "地图总长度：" + this.mapEditor.mapLength.toFixed(2);
    }
}
