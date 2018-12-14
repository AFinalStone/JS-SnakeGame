/**
 * Created by AF
 * 游戏对象
 */

(function () {

    var that = null;

    function Game(map) {
        this.map = map;
        this.food = new Food();
        this.snake = new Snake();
        that = this;
    }


    Game.prototype.init = function () {
        this.food.init(this.map);
        this.snake.init(this.map);
        this.runSnake(this.food, this.Snake);
        //调用按键的方法
        this.bindKey();//========================================
    };

    //添加原型方法---设置小蛇可以自动的跑起来
    Game.prototype.runSnake = function (food, map) {

        //自动的去移动
        var timeId = setInterval(function () {
            //此时的this是window
            //移动小蛇
            this.snake.move(food, map);
            //初始化小蛇
            this.snake.init(map);
            //横坐标的最大值
            var maxX = map.offsetWidth / this.snake.width;
            //纵坐标的最大值
            var maxY = map.offsetHeight / this.snake.height;
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

    window.Game = Game;
}());
