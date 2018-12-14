/**
 * Created by AF
 * 食物对象
 */
(function () {

    var elements = [];//用来保存每个小方块食物的

    function Food(x, y, width, height,color) {
        this.x = x || 0;
        this.y = y || 0;
        //宽和高
        this.width = width || 20;
        this.height = height || 20;
        //背景颜色
        this.color = color || "red";
    }

    Food.prototype.init = function(map){
        //移除之前的食物
        remove();
        //创建食物
        var div = document.createElement("div");
        //把食物添加到map中
        map.appendChild(div);
        //设置div的样式
        div.style.width = this.width + "px";
        div.style.height = this.height + "px";
        div.style.backgroundColor = this.color;
        //先脱离文档流
        div.style.position = "absolute";
        //设置位置
        this.x = parseInt(Math.random() * (map.offsetWidth / this.width)) * this.width;
        this.y = parseInt(Math.random() * (map.offsetHeight / this.height)) * this.height;
        div.style.left = this.x + "px";
        div.style.top = this.y + "px";

        elements.push(div);
    }

    function remove() {
        for (var i=0; i<elements.length; i++){
           var ele =  elements[i];
           ele.parentNode.removeChild(ele);
           elements.slice(i,1);
        }
    }
    window.Food = Food;
}());
