$(function() {
    const Mod = {
        init() {
            this.getCanvas();
            this.draw();

            this.getTypedArray();
        },

        /**
            需要注意的是，上面代码的typedArray虽然是一个TypedArray数组，但是它的视图类型是一种针对Canvas元素的专有类型Uint8ClampedArray。
            这个视图类型的特点，就是专门针对颜色，把每个字节解读为无符号的8位整数，即只能取值0～255，而且发生运算的时候自动过滤高位溢出。这为图像处理带来了巨大的方便。

            举例来说，如果把像素的颜色值设为Uint8Array类型，那么乘以一个gamma值的时候，就必须这样计算：

            u8[i] = Math.min(255, Math.max(0, u8[i] * gamma));
            因为Uint8Array类型对于大于255的运算结果（比如0xFF+1），会自动变为0x00，所以图像处理必须要像上面这样算。
            这样做很麻烦，而且影响性能。如果将颜色值设为Uint8ClampedArray类型，计算就简化许多。

            pixels[i] *= gamma;
            Uint8ClampedArray类型确保将小于0的值设为0，将大于255的值设为255。注意，IE 10不支持该类型。
         */
        getTypedArray() {
            const can = this.can,
                cxt = this.cxt,
                imageData = cxt.getImageData(0, 0, can.width(), can.height());

            const uint8ClampedArrray = imageData.data;

            console.log(uint8ClampedArrray);
        },

        draw() {
            const cxt = this.cxt;
            cxt.moveTo(0, 0);
            cxt.lineTo(this.can.width(), this.can.height());
            var gnt1 = cxt.createLinearGradient(0, 0, 400, 300); //线性渐变的起止坐标
            gnt1.addColorStop(0, 'red'); //创建渐变的开始颜色，0表示偏移量，个人理解为直线上的相对位置，最大为1，一个渐变中可以写任意个渐变颜色
            gnt1.addColorStop(1, 'yellow');
            cxt.lineWidth = 3;
            cxt.strokeStyle = gnt1;
            cxt.stroke();
        },

        getCanvas() {
            const can = this.can = $('#canvas') || [];
            this.cxt = can[0].getContext('2d');
        }
    }

    Mod.init();
})
