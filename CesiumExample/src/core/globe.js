import Vue from "vue";
import * as Cesium from "cesium/Cesium";
class Globe {
    constructor() {
        this.modelsLevel = []
    }
    //初始化球方法
    initGlobe() {
        const self = this;
        let viewer = new Cesium.Viewer("cesiumContainer", {
            animation: false, //是否创建动画小部件（左下角）
            timeline: false, //是否粗昂见时间轴小部件（底部）
            baseLayerPicker: false, //是否创建底图切换小部件（右上）
            fullscreenButton: false, //是否创建全屏小部件（右上）
            geocoder: false, //是否创建搜索小部件（右上）
            homeButton: true, //是否创建默认位置小部件（右上）
            navigationHelpButton: true, //是否创建导航小部件（右上）
            sceneModePicker: false, //是否设置维度选择小部件，二维，三维，2,5维（右上）
            vrButton: true, //进入vr模式按钮
            fullscreenButton: true, //全屏
            infoBox: false, //默认消息框
            //terrainProvider: Cesium.createWorldTerrain(), //添加全球地形
            imageryProvider: new Cesium.WebMapTileServiceImageryProvider({ //添加底图图层
                url: MapConfig.tdtYXURL,  //天地图影像
                layer: "tdtAnnoLayer",
                style: "default",
                format: "image/jpeg",
                tileMatrixSetID: "GoogleMapsCompatible",
                show: false
            }),
        });
        viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
            url: MapConfig.tdtURL,
            layer: "tdtAnnoLayer",
            style: "default",
            format: "image/jpeg",
            tileMatrixSetID: "GoogleMapsCompatible",
            show: false
        }));
        Vue.prototype.viewer = viewer

    }
    //开场动画
    flytochina_hz(minx, miny, maxx, maxy, viewer) {
        var self = this;
        self.xmin = minx
        self.ymin = miny
        self.xmax = maxx
        self.ymax = maxy
        var camera = viewer.scene.camera;
        var tokyoOptions = {
            destination: Cesium.Cartesian3.fromDegrees(99.7478, 36.1218, 30000000), //Cesium.Rectangle.fromDegrees(80, 22, 130, 50),
            duration: 5
        };
        var laOptions = {
            destination: Cesium.Rectangle.fromDegrees(minx, miny, maxx, maxy),//(114.368877, 23.050795, 114.459085, 23.108199),//Cesium.Cartesian3.fromDegrees(114.3873, 23.1107, 100000),
            duration: 4,
            complete: function () {
            },
        };
        tokyoOptions.complete = function () {
            setTimeout(function () {
                camera.flyTo(laOptions);
            }, 100);
        };
        camera.flyTo(tokyoOptions);
    }
    //加载3dtiles模型
    add3DtilesData(viewer, url, height, node) {
        const self = this;
        viewer.scene.globe.depthTestAgainstTerrain = true;
        var tileset = new Cesium.Cesium3DTileset({
            url: url,
            preferLeaves: true,
        });
        viewer.scene.primitives.add(tileset);
        if (node) {
            if (node.initPosition || node.INIT_POSITION) {
                let p = node.initPosition ? node.initPosition : node.INIT_POSITION;
                let positions = p.split(',')
                viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(positions[0], positions[1], positions[2]),
                });
            } else {
                viewer.zoomTo(tileset);
                //viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(60, -30.0, 3000));
            }
        } else {
            //viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(60, -30.0, 30000));
            viewer.zoomTo(tileset);
        }
        tileset.readyPromise.then(function () {
            if (height) {
                height = Number(height);
                if (isNaN(height)) {
                    return;
                }
            }
            var cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
            var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
            var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height);
            var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
            tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
            if (node.modelPositionCalibration || node.MODEL_POSITION_CALIBRATION) {
                let p = node.modelPositionCalibration ? node.modelPositionCalibration : node.MODEL_POSITION_CALIBRATION;
                let positions = p.split(',')
                // 模型的位置坐标（三维笛卡尔坐标）。Cartesian3
                var position = Cesium.Cartesian3.fromDegrees(positions[0], positions[1], positions[2]);
                // 模型的位置矩阵(WGS84 Matrix4)。
                var mat = Cesium.Transforms.eastNorthUpToFixedFrame(position);
                tileset._root.transform = mat;
            }

        }).otherwise(function (error) {
            console.log(error);
        });
        return tileset;
    }
    //修改cesium默认样式
    changeInitGlobe(viewer) {
        const self = this;
        //隐藏cesium版权信息
        viewer.cesiumWidget.creditContainer.style.display = "none";
        //屏蔽Cesium的默认双击追踪选中entity行为
        viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        //导航插件
        var options = {};
        // 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和Cesium.Rectangle.
        options.defaultResetView = Cesium.Cartographic.fromDegrees(
            110,
            30,
            2000000
        );
        // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
        options.enableCompass = true;
        // 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件 将不会添加到地图中。
        options.enableZoomControls = true;
        // 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
        options.enableDistanceLegend = true;
        // 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
        options.enableCompassOuterRing = true;

        //CesiumNavigation(viewer, options);
        //自定义小控件位置
        //"flex-direction":"column"使每个子元素垂直排列，位置放于距底部5vh,top:unset 默认是有top值所有unset去掉
        $(".cesium-viewer-toolbar").css({
            display: "flex",
            "flex-direction": "column",
            bottom: "120px",
            top: "unset",
        });
        $(".cesium-viewer-toolbar .cesium-sceneModePicker-wrapper").css(
            "width",
            "fit-content"
        );
        $(
            ".cesium-sceneModePicker-wrapper .cesium-sceneModePicker-dropDown-icon"
        ).css({ float: "left" });
        $(".cesium-navigation-help").css({
            top: "unset",
            bottom: "0",
            right: "40px",
            "transform-origin": "right bottom",
        });
        $(".cesium-viewer-fullscreenContainer").css({
            bottom: "86px",
            right: "9px",
            width: "32px",
            height: "32px",
        });
        $(".cesium-viewer-vrContainer").css({
            bottom: "49px",
            right: "9px",
            width: "32px",
            height: "32px",
            "border-radius": "4px",
        });
        $(".cesium-button").css({ "border-radius": "4px" });

        //修改小控件显示名称
        viewer.homeButton.viewModel.tooltip = "初始位置"; //默认位置设置
        viewer.navigationHelpButton.viewModel.tooltip = "帮助"; //导航设置
        //viewer.sceneModePicker.viewModel.tooltip2D = "二维视图"
        //viewer.sceneModePicker.viewModel.tooltip3D = "三维视图"
        //viewer.sceneModePicker.viewModel.tooltipColumbusView = "哥伦布视图"
        //帮组按钮内容进行汉化
        var clickHelper = viewer.navigationHelpButton.container.getElementsByClassName(
            "cesium-click-navigation-help"
        )[0];
        var touchHelper = viewer.navigationHelpButton.container.getElementsByClassName(
            "cesium-touch-navigation-help"
        )[0];

        var button = viewer.navigationHelpButton.container.getElementsByClassName(
            "cesium-navigation-button-right"
        )[0];
        button.innerHTML = button.innerHTML.replace(">Touch", ">触摸屏");
        button = viewer.navigationHelpButton.container.getElementsByClassName(
            "cesium-navigation-button-left"
        )[0];
        button.innerHTML = button.innerHTML.replace(">Mouse", ">鼠标");

        var click_help_pan = clickHelper.getElementsByClassName(
            "cesium-navigation-help-pan"
        )[0];
        click_help_pan.innerHTML = "平移";
        var click_help_pan_details = click_help_pan.parentNode.getElementsByClassName(
            "cesium-navigation-help-details"
        )[0];
        click_help_pan_details.innerHTML = "按下左键 + 拖动";

        var click_help_zoom = clickHelper.getElementsByClassName(
            "cesium-navigation-help-zoom"
        )[0];
        click_help_zoom.innerHTML = "旋转";
        click_help_zoom.parentNode.getElementsByClassName(
            "cesium-navigation-help-details"
        )[0].innerHTML = "按下右键+拖动";
        click_help_zoom.parentNode.getElementsByClassName(
            "cesium-navigation-help-details"
        )[1].innerHTML = "";

        var click_help_rotate = clickHelper.getElementsByClassName(
            "cesium-navigation-help-rotate"
        )[0];
        click_help_rotate.innerHTML = "缩放";
        click_help_rotate.parentNode.getElementsByClassName(
            "cesium-navigation-help-details"
        )[0].innerHTML = "滚动鼠标滚轮";
        click_help_rotate.parentNode.getElementsByClassName(
            "cesium-navigation-help-details"
        )[1].innerHTML = "";

        //触屏操作
        var touch_help_pan = touchHelper.getElementsByClassName(
            "cesium-navigation-help-pan"
        )[0];
        touch_help_pan.innerHTML = "平移";
        touch_help_pan.parentNode.getElementsByClassName(
            "cesium-navigation-help-details"
        )[0].innerHTML = "单指拖动";

        var touch_help_zoom = touchHelper.getElementsByClassName(
            "cesium-navigation-help-zoom"
        )[0];
        touch_help_zoom.innerHTML = "缩放";
        touch_help_zoom.parentNode.getElementsByClassName(
            "cesium-navigation-help-details"
        )[0].innerHTML = "双指捏合";

        var touch_help_tilt = touchHelper.getElementsByClassName(
            "cesium-navigation-help-rotate"
        )[0];
        touch_help_tilt.innerHTML = "俯仰";
        touch_help_tilt.parentNode.getElementsByClassName(
            "cesium-navigation-help-details"
        )[0].innerHTML = "双指同向拖动";

        var touch_help_rotate = touchHelper.getElementsByClassName(
            "cesium-navigation-help-tilt"
        )[0];
        touch_help_rotate.innerHTML = "旋转";
        touch_help_rotate.parentNode.getElementsByClassName(
            "cesium-navigation-help-details"
        )[0].innerHTML = "双指反向拖动";
    }

}
export default new Globe()