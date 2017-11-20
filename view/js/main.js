$(document).ready(function () {

    var vm =new Vue({
        el:'#main',
        data:{
            articleList:[],
            sort:'前端'
        },
        mounted(){
            "use strict";
          this.getData('前端');
          $('.spider').css('display','none');
        },
        methods:{
            initChart:function (obj) {
                var options = {
                    title: {
                        text: '掘金历史最热'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['收藏数','评论数','查看数']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    dataZoom:{
                        show: true,
                        realtime: true,
                        start: 0,
                        end: 10,
                    },
                    xAxis: {
                        type:'category',
                        boundaryGap: false,
                        data: obj.title,
                        axisLabel:{
                            interval:0 ,
                            formatter:function(value)
                            {
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
                    yAxis: [{
                        type:'value',
                        name:'收藏与评论'
                    },{
                        type:'value',
                        name:'浏览数'
                    }],
                    series: [
                        {
                            name:'收藏数',
                            type:'line',
                            // stack:'总量',
                            data:obj.collect
                        },
                        {
                            name:'评论数',
                            type:'line',
                            // stack:'总量',
                            data:obj.comment
                        },
                        {
                            name:'浏览数',
                            yAxisIndex:1,
                            type:'line',
                            // stack:'总量',
                            data:obj.view
                        }
                    ]

                };
                var ele = document.getElementById('line');
                var myChart = echarts.init(ele);
                myChart.setOption(options);
            },
            getData:function (val) {
                var self= this;
                self.sort = val;
                axios.get('http://localhost:5000/api/getListByCategory?sort='+self.sort)
                    .then(function (response) {
                        var data = response.data;
                        if(data.length<=0){
                            $('.spider').css('display','block');
                            $('#menu').css('display','none');
                            alert('数据库中不存在数据，请进行采集后查询');
                        }
                        self.articleList =data;
                        var arryCollect = [],
                            arryComment = [],
                            arryView = [],
                            arryTitle = [];
                        for(var i=0;i<data.length;i++){
                             arryCollect.push(data[i].collectionCount);
                             arryComment.push(data[i].commentsCount);
                             arryView.push(data[i].viewsCount);
                             arryTitle.push(data[i].title)
                        }
                        var obj = {
                            collect:arryCollect,
                            comment:arryComment,
                            view:arryView,
                            title:arryTitle
                        };
                        console.log(obj);
                        self.initChart(obj);
                        self.loadInfo();
                    });
            },
            loadInfo:function () {
                var $container = $('#masonry');
                $container.imagesLoaded(function () {
                    setTimeout(function () {
                        $container.masonry({
                            itemSelector: '.box'
                        });
                    },1000)

                })
            },
            spiderData:function (val) {
                var self = this;
                axios.get('http://localhost:5000/api/sendSpiderByCategory?sort='+val)
                    .then(function (response) {
                    if(response.data.msg==='ok'){
                        $('.spider').css('display','none');
                        $('#menu').css('display','block');
                        alert('数据采集成功');
                        self.getData(val);
                    }
                })
            },
            goTop:function () {
                this.click(function (e) {
                    e.preventDefault();
                    $(document.body).animate({scrollTop: 0}, 800);
                });
            }
        }
    });

});
