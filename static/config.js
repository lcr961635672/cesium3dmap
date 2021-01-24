// 所有配置参数设置
//地图参数地址
const MapConfig = {
    //默认卫星地址 即微软卫星
    initURL: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer', 
    //天地图影像地址
    tdtYXURL: 'http://t0.tianditu.com/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&TILEMATRIXSET=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&STYLE=default&FORMAT=tiles&tk=26e04a33ff17a2107699002df53e5063',//天地图影像				gaodeURL: 'http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali', //高德卫星地址
    //天地图标注地址
    tdtURL: "http://t0.tianditu.com/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&FORMAT=tiles&tk=26e04a33ff17a2107699002df53e5063", //天地图影像注记卫星地址

    
}