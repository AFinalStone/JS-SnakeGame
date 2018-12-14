# JS-SnakeGame
效果：
![效果图](snake.gif)

#### 1、在页面添加类名为map的div，设置相应的风格

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>title</title>
    <style>
        .map {
            width: 800px;
            height: 600px;
            background-color: #CCC;
            position: relative;
        }
    </style>
</head>
<body>
<!--画出地图,设置样式-->
<div class="map"></div>
</body>
</html>
```

#### 2、定义食物对象

- 我们需要一个食物对象，食物对象有坐标，宽和高，以及颜色。游戏对象初始化的时候
需要先清除之前可能存在的食物,食物每次的位置是随机生成的，但是不能超过map所在的范围。

```javascript
(function () {
    var elements = [];//用来保存每个小方块食物的
    //食物就是一个对象,有宽,有高,有颜色,有横纵坐标,先定义构造函数,然后创建对象
    function Food(x, y, width, height, color) {
        //横纵坐标
        this.x = x || 0;
        this.y = y || 0;
        //宽和高
        this.width = width || 20;
        this.height = height || 20;
        //背景颜色
        this.color = color || "green";
    }

    //为原型添加初始化的方法(作用：在页面上显示这个食物)
    //因为食物要在地图上显示,所以,需要地图的这个参数(map---就是页面上的.class=map的这个div)
    Food.prototype.init = function (map) {
        //先删除这个小食物
        //外部无法访问的函数
        remove();

        //创建div
        var div = document.createElement("div");
        //把div加到map中
        map.appendChild(div);
        //设置div的样式
        div.style.width = this.width + "px";
        div.style.height = this.height + "px";
        div.style.backgroundColor = this.color;
        //先脱离文档流
        div.style.position = "absolute";
        //随机横纵坐标
        this.x = parseInt(Math.random() * (map.offsetWidth / this.width)) * this.width;
        this.y = parseInt(Math.random() * (map.offsetHeight / this.height)) * this.height;
        div.style.left = this.x + "px";
        div.style.top = this.y + "px";

        //把div加入到数组elements中
        elements.push(div);
    };

    //私有的函数---删除食物的
    function remove() {
        //elements数组中有这个食物
        for (var i = 0; i < elements.length; i++) {
            var ele = elements[i];
            //找到这个子元素的父级元素,然后删除这个子元素
            ele.parentNode.removeChild(ele);
            //再次把elements中的这个子元素也要删除
            elements.splice(i, 1);
        }
    }

    //把Food暴露给Window,外部可以使用
    window.Food = Food;
}());

```

#### 3、定义贪食蛇对象

- 贪食蛇是有长度的，所以他的body是一个div的数组，还有我们要定义贪食蛇body的
每个部分div的长度和宽度，以及贪食蛇当前行进的方向，并为贪食蛇添加初始化和移动的方法

```javascript
(function () {
    var elements = [];//存放小蛇的每个身体部分
    //小蛇的构造函数
    function Snake(width, height, direction) {
        //小蛇的每个部分的宽
        this.width = width || 20;
        this.height = height || 20;
        //小蛇的身体
        this.body = [
            {x: 3, y: 2, color: "red"},//头
            {x: 2, y: 2, color: "orange"},//身体
            {x: 1, y: 2, color: "orange"}//身体
        ];
        //方向
        this.direction = direction || "right";
    }

    //为原型添加方法--小蛇初始化的方法
    Snake.prototype.init = function (myMap) {
        //先删除之前的小蛇
        remove();//===========================================

        //循环遍历创建div
        for (var i = 0; i < this.body.length; i++) {
            //数组中的每个数组元素都是一个对象
            var obj = this.body[i];
            //创建div
            var div = document.createElement("div");
            //把div加入到map地图中
            myMap.appendChild(div);
            //设置div的样式
            div.style.position = "absolute";
            div.style.width = this.width + "px";
            div.style.height = this.height + "px";
            //横纵坐标
            div.style.left = obj.x * this.width + "px";
            div.style.top = obj.y * this.height + "px";
            //背景颜色
            div.style.backgroundColor = obj.color;
            //方向暂时不定
            //把div加入到elements数组中----目的是为了删除
            elements.push(div);
        }
    };

    //为原型添加方法---小蛇动起来
    Snake.prototype.move = function (food, map) {
        //改变小蛇的身体的坐标位置
        var i = this.body.length - 1;//2
        for (; i > 0; i--) {
            this.body[i].x = this.body[i - 1].x;
            this.body[i].y = this.body[i - 1].y;
        }
        //判断方向---改变小蛇的头的坐标位置
        switch (this.direction) {
            case "right":
                this.body[0].x += 1;
                break;
            case "left":
                this.body[0].x -= 1;
                break;
            case "top":
                this.body[0].y -= 1;
                break;
            case "bottom":
                this.body[0].y += 1;
                break;
        }

        //判断有没有吃到食物
        //小蛇的头的坐标和食物的坐标一致
        var headX=this.body[0].x*this.width;
        var headY=this.body[0].y*this.height;
        //判断小蛇的头的坐标和食物的坐标是否相同
        if(headX==food.x&&headY==food.y){
            //获取小蛇的最后的尾巴
            var last=this.body[this.body.length-1];
            //把最后的蛇尾复制一个,重新的加入到小蛇的body中
            this.body.push({
                x:last.x,
                y:last.y,
                color:last.color
            });
            //把食物删除,重新初始化食物
            food.init(map);
        }
    }
    ;//删除小蛇的私有的函数=============================================================================
    function remove() {
        //删除map中的小蛇的每个div,同时删除elements数组中的每个元素,从蛇尾向蛇头方向删除div
        var i = elements.length - 1;
        for (; i >= 0; i--) {
            //先从当前的子元素中找到该子元素的父级元素,然后再弄死这个子元素
            var ele = elements[i];
            //从map地图上删除这个子元素div
            ele.parentNode.removeChild(ele);
            elements.splice(i, 1);
        }
    }

    //把Snake暴露给window,外部可以访问
    window.Snake = Snake;
}());
```

#### 3、定义贪食蛇游戏对象

- 这里再定义第三个对象，游戏对象Game，我们需要为游戏对象添加Food和Snake，map三个对象属性，
并添加初始化方法，来初始化具体的数值

- 为Game对象添加runSnake和bindKey方法，runSnake内部通过定时器来实现贪食蛇的动态移动，bindKey
方法通过document对象来获取当前用户按下的具体键盘按键，当用户按下上下左右的时候，动态的更新贪食蛇当前需要前进的方向

```javascript
(function () {

    var that = null;//该变量的目的就是为了保存游戏Game的实例对象-------

    //游戏的构造函数
    function Game(map) {
        this.food = new Food();//食物对象
        this.snake = new Snake();//小蛇对象
        this.map = map;//地图
        that = this;//保存当前的实例对象到that变量中-----------------此时that就是this
    }

    //初始化游戏-----可以设置小蛇和食物显示出来
    Game.prototype.init = function () {
        //初始化游戏
        //食物初始化
        this.food.init(this.map);
        //小蛇初始化
        this.snake.init(this.map);
        //调用自动移动小蛇的方法========================||调用了小蛇自动移动的方法
        this.runSnake(this.food, this.map);
        //调用按键的方法
        this.bindKey();//========================================
    };

    //添加原型方法---设置小蛇可以自动的跑起来
    Game.prototype.runSnake = function (food, myMap) {

        //自动的去移动
        var timeId = setInterval(function () {
            //此时的this是window
            //移动小蛇
            this.snake.move(food, myMap);
            //初始化小蛇
            this.snake.init(myMap);
            //横坐标的最大值
            var maxX = myMap.offsetWidth / this.snake.width;
            //纵坐标的最大值
            var maxY = myMap.offsetHeight / this.snake.height;
            //小蛇的头的坐标
            var headX = this.snake.body[0].x;
            var headY = this.snake.body[0].y;
            //横坐标
            if (headX < 0 || headX >= maxX) {
                //撞墙了,停止定时器
                clearInterval(timeId);
                alert("游戏结束");
            }
            //纵坐标
            if (headY < 0 || headY >= maxY) {
                //撞墙了,停止定时器
                clearInterval(timeId);
                alert("游戏结束");
            }
        }.bind(that), 300);
    };

    //添加原型方法---设置用户按键,改变小蛇移动的方向
    Game.prototype.bindKey=function () {

        //获取用户的按键,改变小蛇的方向
        document.addEventListener("keydown",function (e) {
            //这里的this应该是触发keydown的事件的对象---document,
            //所以,这里的this就是document
            //获取按键的值
            switch (e.keyCode){
                case 37:this.snake.direction="left";break;
                case 38:this.snake.direction="top";break;
                case 39:this.snake.direction="right";break;
                case 40:this.snake.direction="bottom";break;
            }
        }.bind(that),false);
    };

    //把Game暴露给window,外部就可以访问Game对象了
    window.Game = Game;
}());

```
#### 4、创建Game对象，并初始化开启游戏

```javascript
    //初始化游戏对象
    var gm = new Game(document.querySelector(".map"));

    //初始化游戏---开始游戏
    gm.init();
```
