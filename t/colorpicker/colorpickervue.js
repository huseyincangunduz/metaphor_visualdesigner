let mixing = {
    methods: {
        setColorValue(color) {
            let rgba = { r: 0, g: 0, b: 0, a: 1 }
            if (/#/.test(color)) {
                rgba = this.hex2rgb(color)
            } else if (/rgb/.test(color)) {
                rgba = this.rgb2rgba(color)
            } else if (typeof color === 'string') {
                rgba = this.rgb2rgba(`rgba(${color})`)
            } else if (Object.prototype.toString.call(color) === '[object Object]') {
                rgba = color
            }
            const { r, g, b, a } = rgba
            const { h, s, v } = this.rgb2hsv(rgba)
            return { r, g, b, a: a === undefined ? 1 : a, h, s, v }
        },
        createAlphaSquare(size) {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            const doubleSize = size * 2
            canvas.width = doubleSize
            canvas.height = doubleSize

            ctx.fillStyle = '#ffffff'
            ctx.fillRect(0, 0, doubleSize, doubleSize)
            ctx.fillStyle = '#ccd5db'
            ctx.fillRect(0, 0, size, size)
            ctx.fillRect(size, size, size, size)

            return canvas
        },
        createLinearGradient(direction, ctx, width, height, color1, color2) {
            // l 横向 p 纵向
            const isL = direction === 'l'
            const gradient = ctx.createLinearGradient(0, 0, isL ? width : 0, isL ? 0 : height)
            gradient.addColorStop(0.01, color1)
            gradient.addColorStop(0.99, color2)
            ctx.fillStyle = gradient
            ctx.fillRect(0, 0, width, height)
        },
        rgb2hex({ r, g, b }, toUpper) {
            const change = val => ('0' + Number(val).toString(16)).slice(-2)
            const color = `#${change(r)}${change(g)}${change(b)}`
            return toUpper ? color.toUpperCase() : color
        },
        hex2rgb(hex) {
            hex = hex.slice(1)
            const change = val => parseInt(val, 16) || 0 // 避免NaN的情况
            return {
                r: change(hex.slice(0, 2)),
                g: change(hex.slice(2, 4)),
                b: change(hex.slice(4, 6))
            }
        },
        rgb2rgba(rgba) {
            if (typeof rgba === 'string') {
                rgba = (/rgba?\((.*?)\)/.exec(rgba) || ['', '0,0,0,1'])[1].split(',')
                return {
                    r: Number(rgba[0]) || 0,
                    g: Number(rgba[1]) || 0,
                    b: Number(rgba[2]) || 0,
                    a: Number(rgba[3] ? rgba[3] : 1) // 避免为0的情况
                }
            } else {
                return rgba
            }
        },
        rgb2hsv({ r, g, b }) {
            r = r / 255
            g = g / 255
            b = b / 255
            const max = Math.max(r, g, b)
            const min = Math.min(r, g, b)
            const delta = max - min
            let h = 0
            if (max === min) {
                h = 0
            } else if (max === r) {
                if (g >= b) {
                    h = (60 * (g - b)) / delta
                } else {
                    h = (60 * (g - b)) / delta + 360
                }
            } else if (max === g) {
                h = (60 * (b - r)) / delta + 120
            } else if (max === b) {
                h = (60 * (r - g)) / delta + 240
            }
            h = Math.floor(h)
            let s = parseFloat((max === 0 ? 0 : 1 - min / max).toFixed(2))
            let v = parseFloat(max.toFixed(2))
            return { h, s, v }
        }
    }
};

let alpha = Vue.component("alpha", {
    mixins: [mixing],
    template: `
    <div
    class="color-alpha"
    @mousedown.prevent.stop="selectAlpha"
    >
    <canvas ref="canvasAlpha" />
    <div
        :style="slideAlphaStyle"
        class="slide"
    />
</div>
    `,
    props: {
        color: {
            type: String,
            default: '#000000'
        },
        rgba: {
            type: Object,
            default: null
        },
        width: {
            type: Number,
            default: 15
        },
        height: {
            type: Number,
            default: 152
        }
    },
    data() {
        return {
            slideAlphaStyle: {},
            alphaSize: 5
        }
    },
    watch: {
        color() {
            this.renderColor()
        },
        'rgba.a'() {
            this.renderSlide()
        }
    },
    mounted() {
        this.renderColor()
        this.renderSlide()
    },
    methods: {
        renderColor() {
            const canvas = this.$refs.canvasAlpha
            const width = this.width
            const height = this.height
            const size = this.alphaSize
            const canvasSquare = this.createAlphaSquare(size)

            const ctx = canvas.getContext('2d')
            canvas.width = width
            canvas.height = height

            ctx.fillStyle = ctx.createPattern(canvasSquare, 'repeat')
            ctx.fillRect(0, 0, width, height)

            this.createLinearGradient('p', ctx, width, height, 'rgba(255,255,255,0)', this.color)
        },
        renderSlide() {
            this.slideAlphaStyle = {
                top: this.rgba.a * this.height - 2 + 'px'
            }
        },
        selectAlpha(e) {
            const { top: hueTop } = this.$el.getBoundingClientRect()

            const mousemove = e => {
                let y = e.clientY - hueTop

                if (y < 0) {
                    y = 0
                }
                if (y > this.height) {
                    y = this.height
                }

                let a = parseFloat((y / this.height).toFixed(2))
                this.$emit('selectAlpha', a)
            }

            mousemove(e)

            const mouseup = () => {
                document.removeEventListener('mousemove', mousemove)
                document.removeEventListener('mouseup', mouseup)
            }

            document.addEventListener('mousemove', mousemove)
            document.addEventListener('mouseup', mouseup)
        }
    }
}
);

let box = Vue.component("box", {
    template: `
    <div class="color-type">
    <span class="name">
        {{ name }}
    </span>
    <input
        v-model="modelColor"
        class="value"
    >
</div>
    `,
    mixins: [mixing],
    props: {
        name: {
            type: String,
            default: ''
        },
        color: {
            type: String,
            default: ''
        }
    },
    computed: {
        modelColor: {
            get() {
                return this.color
            },
            set(val) {
                this.$emit('inputColor', val)
            }
        }
    }
}
);

let colors = Vue.component("colors", {
    mixins: [mixing],
    props: {
        color: {
            type: String,
            default: '#000000'
        },
        colorsDefault: {
            type: Array,
            default: () => []
        },
        colorsHistoryKey: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            imgAlphaBase64: '',
            colorsHistory: JSON.parse(localStorage.getItem(this.colorsHistoryKey)) || []
        }
    },
    created() {
        this.imgAlphaBase64 = this.createAlphaSquare(4).toDataURL()
    },
    destroyed() {
        this.setColorsHistory(this.color)
    },
    methods: {
        selectColor(color) {
            this.$emit('selectColor', color)
        },
        setColorsHistory(color) {
            if (!color) {
                return
            }
            const colors = this.colorsHistory
            const index = colors.indexOf(color)
            if (index >= 0) {
                colors.splice(index, 1)
            }
            if (colors.length >= 8) {
                colors.length = 7
            }
            colors.unshift(color)
            this.colorsHistory = colors
            localStorage.setItem(this.colorsHistoryKey, JSON.stringify(colors))
        }
    },
    template: `
    <div>
    <ul class="colors">
        <li
            v-for="item in colorsDefault"
            :key="item"
            class="item"
            @click="selectColor(item)"
        >
            <div
                :style="{ background: 'url(${imgAlphaBase64})' }"
                class="alpha"
            />
            <div
                :style="{ background: item }"
                class="color"
            />
        </li>
    </ul>
    <ul
        v-if="colorsHistory.length"
        class="colors history"
    >
        <li
            v-for="item in colorsHistory"
            :key="item"
            class="item"
            @click="selectColor(item)"
        >
            <div
                :style="{ background: 'url(${imgAlphaBase64})' }"
                class="alpha"
            />
            <div
                :style="{ background: item }"
                class="color"
            />
        </li>
    </ul>
</div>
    `,

});

let hue = Vue.component("hue", {
    template: `    <div
    class="hue"
    @mousedown.prevent.stop="selectHue"
>
    <canvas ref="canvasHue" />
    <div
        :style="slideHueStyle"
        class="slide"
    />`,
    props: {
        hsv: {
            type: Object,
            default: null
        },
        width: {
            type: Number,
            default: 15
        },
        height: {
            type: Number,
            default: 152
        }
    },
    data() {
        return {
            slideHueStyle: {}
        }
    },
    // 不能监听，否则操作saturation时，这里的slide会抖动
    // watch: {
    //     'hsv.h'() {
    //         this.renderSlide()
    //     }
    // },
    mounted() {
        this.renderColor()
        this.renderSlide()
    },
    methods: {
        renderColor() {
            const canvas = this.$refs.canvasHue
            const width = this.width
            const height = this.height
            const ctx = canvas.getContext('2d')
            canvas.width = width
            canvas.height = height

            const gradient = ctx.createLinearGradient(0, 0, 0, height)
            gradient.addColorStop(0, '#FF0000') // 红
            gradient.addColorStop(0.17 * 1, '#FF00FF') // 紫
            gradient.addColorStop(0.17 * 2, '#0000FF') // 蓝
            gradient.addColorStop(0.17 * 3, '#00FFFF') // 青
            gradient.addColorStop(0.17 * 4, '#00FF00') // 绿
            gradient.addColorStop(0.17 * 5, '#FFFF00') // 黄
            gradient.addColorStop(1, '#FF0000') // 红
            ctx.fillStyle = gradient
            ctx.fillRect(0, 0, width, height)
        },
        renderSlide() {
            this.slideHueStyle = {
                top: (1 - this.hsv.h / 360) * this.height - 2 + 'px'
            }
        },
        selectHue(e) {
            const { top: hueTop } = this.$el.getBoundingClientRect()
            const ctx = e.target.getContext('2d')

            const mousemove = e => {
                let y = e.clientY - hueTop

                if (y < 0) {
                    y = 0
                }
                if (y > this.height) {
                    y = this.height
                }

                this.slideHueStyle = {
                    top: y - 2 + 'px'
                }
                // 如果用最大值，选择的像素会是空的，空的默认是黑色
                const imgData = ctx.getImageData(0, Math.min(y, this.height - 1), 1, 1)
                const [r, g, b] = imgData.data
                this.$emit('selectHue', { r, g, b })
            }

            mousemove(e)

            const mouseup = () => {
                document.removeEventListener('mousemove', mousemove)
                document.removeEventListener('mouseup', mouseup)
            }

            document.addEventListener('mousemove', mousemove)
            document.addEventListener('mouseup', mouseup)
        }
    }

});

let preview = Vue.component("preview", {
    mixins: [mixing],
    template: `
    <canvas />
    `,
    props: {
        color: {
            type: String,
            default: '#000000'
        },
        width: {
            type: Number,
            default: 100
        },
        height: {
            type: Number,
            default: 30
        }
    },
    data() {
        return {
            alphaSize: 5
        }
    },
    watch: {
        color() {
            this.renderColor()
        }
    },
    mounted() {
        this.renderColor()
    },
    methods: {
        renderColor() {
            const canvas = this.$el
            const width = this.width
            const height = this.height
            const size = this.alphaSize
            const canvasSquare = this.createAlphaSquare(size)

            const ctx = canvas.getContext('2d')
            canvas.width = width
            canvas.height = height

            ctx.fillStyle = ctx.createPattern(canvasSquare, 'repeat')
            ctx.fillRect(0, 0, width, height)

            ctx.fillStyle = this.color
            ctx.fillRect(0, 0, width, height)
        }
    }

});

let saturation = Vue.component("saturation", {
    template: `
    <div
    class="saturation"
    @mousedown.prevent.stop="selectSaturation"
>
    <canvas ref="canvasSaturation" />
    <div
        :style="slideSaturationStyle"
        class="slide"
    />
</div>`,
mixins: [mixing],
props: {
    color: {
        type: String,
        default: '#000000'
    },
    hsv: {
        type: Object,
        default: null
    },
    size: {
        type: Number,
        default: 152
    }
},
data() {
    return {
        slideSaturationStyle: {}
    }
},
// 不能监听，否则自己改变自己时，颜色也会发生变化
// watch: {
//     color() {
//         this.renderColor()
//     }
// },
mounted() {
    this.renderColor()
    this.renderSlide()
},
methods: {
    renderColor() {
        const canvas = this.$refs.canvasSaturation
        const size = this.size
        const ctx = canvas.getContext('2d')
        canvas.width = size
        canvas.height = size

        ctx.fillStyle = this.color
        ctx.fillRect(0, 0, size, size)

        this.createLinearGradient('l', ctx, size, size, '#FFFFFF', 'rgba(255,255,255,0)')
        this.createLinearGradient('p', ctx, size, size, 'rgba(0,0,0,0)', '#000000')
    },
    renderSlide() {
        this.slideSaturationStyle = {
            left: this.hsv.s * this.size - 5 + 'px',
            top: (1 - this.hsv.v) * this.size - 5 + 'px'
        }
    },
    selectSaturation(e) {
        const { top: saturationTop, left: saturationLeft } = this.$el.getBoundingClientRect()
        const ctx = e.target.getContext('2d')

        const mousemove = e => {
            let x = e.clientX - saturationLeft
            let y = e.clientY - saturationTop

            if (x < 0) {
                x = 0
            }
            if (y < 0) {
                y = 0
            }
            if (x > this.size) {
                x = this.size
            }
            if (y > this.size) {
                y = this.size
            }

            // 不通过监听数据变化来修改dom，否则当颜色为#ffffff时，slide会跑到左下角
            this.slideSaturationStyle = {
                left: x - 5 + 'px',
                top: y - 5 + 'px'
            }
            // 如果用最大值，选择的像素会是空的，空的默认是黑色
            const imgData = ctx.getImageData(Math.min(x, this.size - 1), Math.min(y, this.size - 1), 1, 1)
            const [r, g, b] = imgData.data
            this.$emit('selectSaturation', { r, g, b })
        }

        mousemove(e)

        const mouseup = () => {
            document.removeEventListener('mousemove', mousemove)
            document.removeEventListener('mouseup', mouseup)
        }

        document.addEventListener('mousemove', mousemove)
        document.addEventListener('mouseup', mouseup)
    }
}
});

let colorSelectCursor = Vue.component("sucker",{
    template:`

<div>
<svg
    v-if="!isSucking"
    :class="{ active: isOpenSucker }"
    class="sucker"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-12 -12 48 48"
    @click="openSucker"
>
    <path d="M13.1,8.2l5.6,5.6c0.4,0.4,0.5,1.1,0.1,1.5s-1.1,0.5-1.5,0.1c0,0-0.1,0-0.1-0.1l-1.4-1.4l-7.7,7.7C7.9,21.9,7.6,22,7.3,22H3.1C2.5,22,2,21.5,2,20.9l0,0v-4.2c0-0.3,0.1-0.6,0.3-0.8l5.8-5.8C8.5,9.7,9.2,9.6,9.7,10s0.5,1.1,0.1,1.5c0,0,0,0.1-0.1,0.1l-5.5,5.5v2.7h2.7l7.4-7.4L8.7,6.8c-0.5-0.4-0.5-1-0.1-1.5s1.1-0.5,1.5-0.1c0,0,0.1,0,0.1,0.1l1.4,1.4l3.5-3.5c1.6-1.6,4.1-1.6,5.8-0.1c1.6,1.6,1.6,4.1,0.1,5.8L20.9,9l-3.6,3.6c-0.4,0.4-1.1,0.5-1.5,0.1" />
</svg>
<svg
    v-if="isSucking"
    class="sucker"
    viewBox="-16 -16 68 68"
    xmlns="http://www.w3.org/2000/svg"
    stroke="#9099a4"
>
    <g
        fill="none"
        fill-rule="evenodd"
    >
        <g
            transform="translate(1 1)"
            stroke-width="4"
        >
            <circle
                stroke-opacity=".5"
                cx="18"
                cy="18"
                r="18"
            />
            <path d="M36 18c0-9.94-8.06-18-18-18">
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 18 18"
                    to="360 18 18"
                    dur="1s"
                    repeatCount="indefinite"
                />
            </path>
        </g>
    </g>
</svg>
</div>`
,

props: {
    suckerCanvas: {
        type: null, // HTMLCanvasElement
        default: null
    },
    suckerArea: {
        type: Array,
        default: () => []
    }
},
data() {
    return {
        isOpenSucker: false, // 是否处于吸管状态
        suckerPreview: null, // 吸管旁边的预览颜色dom
        isSucking: false // 是否处于吸管等待状态
    }
},
watch: {
    suckerCanvas(newVal) {
        this.isSucking = false
        this.suckColor(newVal)
        newVal.style.cursor = `url(${imgSucker}) 0 32, default`
    }
},
methods: {
    openSucker() {
        if (!this.isOpenSucker) {
            this.isOpenSucker = true
            this.isSucking = true
            this.$emit('openSucker', true)
            document.addEventListener('keydown', this.keydownHandler)
        } else {
            // 和按下esc键的处理逻辑一样
            this.keydownHandler({ keyCode: 27 })
        }
    },
    keydownHandler(e) {
        // esc
        if (e.keyCode === 27) {
            this.isOpenSucker = false
            this.isSucking = false
            this.$emit('openSucker', false)
            document.removeEventListener('keydown', this.keydownHandler)
            document.removeEventListener('mousemove', this.mousemoveHandler)
            document.removeEventListener('mouseup', this.mousemoveHandler)
            if (this.suckerPreview) {
                document.body.removeChild(this.suckerPreview)
                this.suckerPreview = null
            }
        }
    },
    mousemoveHandler(e) {
        const { clientX, clientY } = e
        const { top: domTop, left: domLeft, width, height } = this.suckerCanvas.getBoundingClientRect()
        const x = clientX - domLeft
        const y = clientY - domTop
        const ctx = this.suckerCanvas.getContext('2d')
        const imgData = ctx.getImageData(Math.min(x, width - 1), Math.min(y, height - 1), 1, 1)
        let [r, g, b, a] = imgData.data
        a = parseFloat((a / 255).toFixed(2))
        const style = this.suckerPreview.style
        Object.assign(style, {
            position: 'absolute',
            left: clientX + 20 + 'px',
            top: clientY - 36 + 'px',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            border: '2px solid #fff',
            boxShadow: '0 0 8px 0 rgba(0, 0, 0, 0.16)',
            background: `rgba(${r}, ${g}, ${b}, ${a})`,
            zIndex: 95 // 吸管的小圆圈预览色的层级不能超过颜色选择器
        })
        if (
            clientX >= this.suckerArea[0] &&
            clientY >= this.suckerArea[1] &&
            clientX <= this.suckerArea[2] &&
            clientY <= this.suckerArea[3]
        ) {
            style.display = ''
        } else {
            style.display = 'none'
        }
    },
    suckColor(dom) {
        if (dom && dom.tagName !== 'CANVAS') {
            return
        }

        this.suckerPreview = document.createElement('div')
        document.body.appendChild(this.suckerPreview)

        document.addEventListener('mousemove', this.mousemoveHandler)
        document.addEventListener('mouseup', this.mousemoveHandler)

        dom.addEventListener('click', e => {
            const { clientX, clientY } = e
            const { top, left, width, height } = dom.getBoundingClientRect()
            const x = clientX - left
            const y = clientY - top
            const ctx = dom.getContext('2d')
            const imgData = ctx.getImageData(Math.min(x, width - 1), Math.min(y, height - 1), 1, 1)
            let [r, g, b, a] = imgData.data
            a = parseFloat((a / 255).toFixed(2))
            this.$emit('selectSucker', { r, g, b, a })
        })
    }
}

});

let colorPicker = Vue.component("colorpicker",{
    
    components: {
        Saturation,
        Hue,
        Alpha,
        Preview,
        Sucker,
        Box,
        Colors
    },
    mixins: [mixin],
    props: {
        color: {
            type: String,
            default: '#000000'
        },
        theme: {
            type: String,
            default: 'dark'
        },
        suckerHide: {
            type: Boolean,
            default: true
        },
        suckerCanvas: {
            type: null, // HTMLCanvasElement
            default: null
        },
        suckerArea: {
            type: Array,
            default: () => []
        },
        colorsDefault: {
            type: Array,
            default: () => [
                '#000000', '#FFFFFF', '#FF1900', '#F47365', '#FFB243', '#FFE623', '#6EFF2A', '#1BC7B1',
                '#00BEFF', '#2E81FF', '#5D61FF', '#FF89CF', '#FC3CAD', '#BF3DCE', '#8E00A7', 'rgba(0,0,0,0)'
            ]
        },
        colorsHistoryKey: {
            type: String,
            default: 'vue-colorpicker-history'
        }
    },
    data() {
        return {
            hueWidth: 15,
            hueHeight: 152,
            previewHeight: 30,
            modelRgba: '',
            modelHex: '',
            r: 0,
            g: 0,
            b: 0,
            a: 1,
            h: 0,
            s: 0,
            v: 0
        }
    },
    computed: {
        isLightTheme() {
            return this.theme === 'light'
        },
        totalWidth() {
            return this.hueHeight + (this.hueWidth + 8) * 2
        },
        previewWidth() {
            return this.totalWidth - (this.suckerHide ? 0 : this.previewHeight)
        },
        rgba() {
            return {
                r: this.r,
                g: this.g,
                b: this.b,
                a: this.a
            }
        },
        hsv() {
            return {
                h: this.h,
                s: this.s,
                v: this.v
            }
        },
        rgbString() {
            return `rgb(${this.r}, ${this.g}, ${this.b})`
        },
        rgbaStringShort() {
            return `${this.r}, ${this.g}, ${this.b}, ${this.a}`
        },
        rgbaString() {
            return `rgba(${this.rgbaStringShort})`
        },
        hexString() {
            return this.rgb2hex(this.rgba, true)
        }
    },
    watch: {
        rgba() {
            this.$emit('changeColor', {
                rgba: this.rgba,
                hsv: this.hsv
            })
        }
    },
    created() {
        Object.assign(this, this.setColorValue(this.color))
        this.setText()
    },
    methods: {
        selectSaturation(color) {
            const { r, g, b, h, s, v } = this.setColorValue(color)
            Object.assign(this, { r, g, b, h, s, v })
            this.setText()
        },
        selectHue(color) {
            const { r, g, b, h, s, v } = this.setColorValue(color)
            Object.assign(this, { r, g, b, h, s, v })
            this.setText()
            this.$nextTick(() => {
                this.$refs.saturation.renderColor()
                this.$refs.saturation.renderSlide()
            })
        },
        selectAlpha(a) {
            this.a = a
            this.setText()
        },
        inputHex(color) {
            const { r, g, b, a, h, s, v } = this.setColorValue(color)
            Object.assign(this, { r, g, b, a, h, s, v, modelRgba: this.rgbaStringShort })
            this.$nextTick(() => {
                this.$refs.saturation.renderColor()
                this.$refs.saturation.renderSlide()
                this.$refs.hue.renderSlide()
            })
        },
        inputRgba(color) {
            const { r, g, b, a, h, s, v } = this.setColorValue(color)
            Object.assign(this, { r, g, b, a, h, s, v, modelHex: this.hexString })
            this.$nextTick(() => {
                this.$refs.saturation.renderColor()
                this.$refs.saturation.renderSlide()
                this.$refs.hue.renderSlide()
            })
        },
        setText() {
            this.modelHex = this.hexString
            this.modelRgba = this.rgbaStringShort
        },
        openSucker(isOpen) {
            this.$emit('openSucker', isOpen)
        },
        selectSucker(color) {
            const { r, g, b, a, h, s, v } = this.setColorValue(color)
            Object.assign(this, { r, g, b, a, h, s, v })
            this.setText()
            this.$nextTick(() => {
                this.$refs.saturation.renderColor()
                this.$refs.saturation.renderSlide()
                this.$refs.hue.renderSlide()
            })
        },
        selectColor(color) {
            const { r, g, b, a, h, s, v } = this.setColorValue(color)
            Object.assign(this, { r, g, b, a, h, s, v })
            this.setText()
            this.$nextTick(() => {
                this.$refs.saturation.renderColor()
                this.$refs.saturation.renderSlide()
                this.$refs.hue.renderSlide()
            })
        }
    },
    template: `
    <div
    class="hu-color-picker"
    :class="{ light: isLightTheme }"
    :style="{ width: totalWidth + 'px' }"
>
    <div class="color-set">
        <Saturation
            ref="saturation"
            :color="rgbString"
            :hsv="hsv"
            :size="hueHeight"
            @selectSaturation="selectSaturation"
        />
        <Hue
            ref="hue"
            :hsv="hsv"
            :width="hueWidth"
            :height="hueHeight"
            @selectHue="selectHue"
        />
        <Alpha
            ref="alpha"
            :color="rgbString"
            :rgba="rgba"
            :width="hueWidth"
            :height="hueHeight"
            @selectAlpha="selectAlpha"
        />
    </div>
    <div
        :style="{ height: previewHeight + 'px' }"
        class="color-show"
    >
        <Preview
            :color="rgbaString"
            :width="previewWidth"
            :height="previewHeight"
        />
        <Sucker
            v-if="!suckerHide"
            :sucker-canvas="suckerCanvas"
            :sucker-area="suckerArea"
            @openSucker="openSucker"
            @selectSucker="selectSucker"
        />
    </div>
    <Box
        name="HEX"
        :color="modelHex"
        @inputColor="inputHex"
    />
    <Box
        name="RGBA"
        :color="modelRgba"
        @inputColor="inputRgba"
    />
    <Colors
        :color="rgbaString"
        :colors-default="colorsDefault"
        :colors-history-key="colorsHistoryKey"
        @selectColor="selectColor"
    />
</div>
    `
    
})