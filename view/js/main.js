$(document).ready(function () {

    //创建一个vue实例
    var vm = new Vue({
        el: '#main',
        data: {
            articleList: [],
            sort: '前端'
        },
        //初始挂载的时候就发送请求，默认请求前端数据
        mounted() {
            "use strict";
            this.getData('前端');
            $('.spider').css('display', 'none');
        },
        methods: {
            //初始化折线图图表
            initChart: function (obj) {
                //主要配置
                var options = {
                    //折线图标题
                    title: {
                        text: '掘金历史最热'
                    },
                    //提示组件框，坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用。
                    tooltip: {
                        trigger: 'axis'
                    },
                    //图例的类型
                    legend: {
                        data: ['收藏数', '评论数', '查看数']
                    },
                    //直角坐标系内绘图网格,距离容器上下左右的距离
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true //grid 区域是否包含坐标轴的刻度标签。
                    },
                    //工具栏。内置有导出图片，数据视图，动态类型切换，数据区域缩放，重置五个工具。
                    toolbox: {
                        feature: {
                            saveAsImage: {}//这里使用导出图片
                        }
                    },
                    //dataZoom 组件 用于区域缩放，从而能自由关注细节的数据信息，或者概览数据整体，或者去除离群点的影响
                    dataZoom: {
                        show: true,
                        realtime: true,
                        start: 0,
                        end: 10,//我们数据范围显示为10篇文章的数据
                    },
                    //直角坐标系 grid 中的 x 轴
                    xAxis: {
                        type: 'category', // 类目轴
                        boundaryGap: false, //坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样。
                        data: obj.title, //类目数据，即文章标题
                        axisLabel: { // X轴标签显示为8个字为一行，防止文字重叠
                            interval: 0,
                            formatter: function (value) {
                                var ret = "";//拼接加\n返回的类目项
                                var maxLength = 8;//每项显示文字个数
                                var valLength = value.length;//X轴类目项的文字个数
                                var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
                                if (rowN > 1)//如果类目项的文字大于3,
                                {
                                    for (var i = 0; i < rowN; i++) {
                                        var temp = "";//每次截取的字符串
                                        var start = i * maxLength;//开始截取的位置
                                        var end = start + maxLength;//结束截取的位置
                                        //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                                        temp = value.substring(start, end) + "\n";
                                        ret += temp; //凭借最终的字符串
                                    }
                                    return ret;
                                }
                                else {
                                    return value;
                                }
                            }
                        }
                    },
                    //Y轴类别，这里建立了两个Y轴，因为数据量差别过大
                    yAxis: [{
                        type: 'value',
                        name: '收藏与评论'
                    }, {
                        type: 'value',
                        name: '浏览数'
                    }],
                    //数据来源
                    series: [
                        {
                            name: '收藏数',
                            type: 'line',
                            // stack:'总量',
                            data: obj.collect
                        },
                        {
                            name: '评论数',
                            type: 'line',
                            // stack:'总量',
                            data: obj.comment
                        },
                        {
                            name: '浏览数',
                            yAxisIndex: 1,
                            type: 'line',
                            // stack:'总量',
                            data: obj.view
                        }
                    ]

                };
                var ele = document.getElementById('line');//获取渲染图表的节点
                var myChart = echarts.init(ele);//初始化一个图表实例
                myChart.setOption(options);//给这个实例设置配置文件
            },
            //获取文章数据，需要接收参数
            getData: function (val) {
                var self = this;
                self.sort = val;
                //使用axios进行请求
                axios.get('http://localhost:5000/api/getListByCategory?sort=' + self.sort)
                    .then(function (response) {
                        var data = response.data;
                        if (data.length <= 0) {
                            $('.spider').css('display', 'block');
                            $('#menu').css('display', 'none');
                            alert('数据库中不存在数据，请进行采集后查询');
                        }
                        self.articleList = data;
                        var arryCollect = [],
                            arryComment = [],
                            arryView = [],
                            arryTitle = [];
                        for (var i = 0; i < data.length; i++) {
                            arryCollect.push(data[i].collectionCount);
                            arryComment.push(data[i].commentsCount);
                            arryView.push(data[i].viewsCount);
                            arryTitle.push(data[i].title)
                        }
                        var obj = {
                            collect: arryCollect,
                            comment: arryComment,
                            view: arryView,
                            title: arryTitle
                        };
                        console.log(obj);
                        self.initChart(obj);
                        self.loadInfo();
                    });
            },
            //加载瀑布流文章显示
            loadInfo: function () {
                var $container = $('#masonry');
                $container.imagesLoaded(function () {
                    setTimeout(function () {
                        $container.masonry({
                            itemSelector: '.box'
                        });
                    }, 1000)

                })
            },
            //爬取数据，根据参数
            spiderData: function (val) {
                var self = this;
                //使用axios进行请求
                axios.get('http://localhost:5000/api/sendSpiderByCategory?sort=' + val)
                    .then(function (response) {
                        if (response.data.msg === 'ok') {
                            $('.spider').css('display', 'none');
                            $('#menu').css('display', 'block');
                            alert('数据采集成功');
                            self.getData(val);
                        }
                    })
            },
            // goTop:function () {
            //     this.click(function (e) {
            //         e.preventDefault();
            //         $(document.body).animate({scrollTop: 0}, 800);
            //     });
            // }
        }
    });

});
