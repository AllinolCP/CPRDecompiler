const {
    v4: uuidv4
} = require('uuid');
const fs = require('fs');
// const process = require('process')

class SimpleAnimation {
    constructor(gameObject) {
		global.animation = this
	}
}


let Phaser = {}
Phaser.GameObjects = {}


class RoomScene {

    constructor(levelName) {
		this.imageCount = 0
		this.containerCount = 0
		this.textCount = 0
		this.spriteCount = 0
		
        this.output = {}
        this.output.id = uuidv4(),
        this.output.sceneType = "SCENE",
        this.output.settings = {
            "sceneKey": levelName,
            "preloadMethodName": "",
            "preloadPackFiles": [],
            "createMethodName": "_create",
            "borderWidth": 1520,
            "borderHeight": 960
        },
        this.output.displayList = []
        this.output.meta = {
            "app": "Phaser Editor 2D - Scene Editor",
            "url": "https://phasereditor2d.com",
            "contentType": "phasereditor2d.core.scene.SceneContentType"
        }
		
		this.animation_output = {}
		
		this.animation_output.anims = []
		this.animation_output.globalTimeScale = 1

        this.image_temp_list = []
        this.add = this
		
		this._create();
		
		
		if(typeof animation != 'undefined') {
			this.anim = {
				"key": animation.animKey,
				"type": "frame",
				"frames": [],
				"frameRate": animation.frameRate,
				"duration": null,
				"skipMissedFrames": true,
				"delay": 0,
				"repeat": -1,
				"repeatDelay": 0,
				"yoyo": false,
				"showOnStart": false,
				"hideOnComplete": false
			}
		
			for (var i = 0; i < animation.frameEnd; i++) {
				let frame = String(i);
				frame = animation.framePrefix + frame.padStart(4, '0');
				this.anim.frames.push({
					key: animation.atlasKey,
					frame,
					duration: 0,
					visible:false
				})
			}
			
			this.animation_output.anims.push(this.anim)
			
			fs.writeFileSync(`./out/${process.argv[3]}.json`, JSON.stringify(this.animation_output, null, 4))
		}


        for (var i = 0; i < this.image_temp_list.length; i++) {
            this.output.displayList.unshift(this.image_temp_list[i])
        }
		for (const [key, val] of Object.entries(this)) {
			console.log(val.constructor.name)
			if(val.constructor.name == 'GameObject') {
				val.label = key;
				val.scope = "CLASS";
			}
			// use key and val
		}
        fs.writeFileSync(`./out/${process.argv[3]}.scene`, JSON.stringify(this.output, null, 4))
		
    }

    image(x, y, texture, frame) {
		
		this.imageCount++
        let id = uuidv4();
        let image_instance = new GameObject(id, "Image", x, y, texture, frame, `Image_${this.imageCount}`)
            this.image_temp_list.unshift(image_instance)
            return image_instance
    }

    sprite(x, y, texture, frame) {
		this.spriteCount++
        let id = uuidv4();
        let image_instance = new GameObject(id, "Sprite", x, y, texture, frame, `Sprite_${this.spriteCount}`)
            return image_instance
    }

    bitmapText(x, y, texture, frame) {
		this.textCount++
        let id = uuidv4();

        let image_instance = new GameObject(id, "BitmapText", x, y, texture, frame, `Text_${this.textCount}`)
            return image_instance
    }

    text(x, y, texture, frame) {
		this.textCount++
        let id = uuidv4();

        let image_instance = new GameObject(id, "BitmapText", x, y, texture, frame, `Text_${this.textCount}`)
            return image_instance
    }

    container(x, y) {
		this.containerCount++
        let id = uuidv4();
        let container = {
            type: "Container",
            id: id,
            label: `Container_${this.containerCount}`,
            x,
            y,
            list: [],
            components: []
        }

        //console.log(this)
        // if (!this.output) this.init()

        this.output.displayList.unshift(container)

        return new Container(this, id, container)
    }

    getItembyId(item) {
        for (var i = 0; i < this.output.displayList.length; i++) {
            if (this.output.displayList[i].id == item.id)
                return this.output.displayList[i];
        }
    }

    removeImagebyValue(item) {
        var index = this.image_temp_list.indexOf(item);
        if (index !== -1) {
            this.image_temp_list.splice(index, 1);
        }
    }

    removeDisplayListbyItem(item) {
        var index = this.output.displayList.indexOf(item);
        if (index !== -1) {
            this.ouptut.displayList.splice(index, 1);
        }
    }

    containerAdd(container, item) {
        let cocainer = this.getItembyId(container)

		// console.log(item.constructor === Container) del item.decompiler
		if (item.type == "Image")
			this.removeImagebyValue(item)
			if (item.type == "Container") {
				this.removeDisplayListbyItem(item);
				item = item.instance
			}

		if (item.type == "Text" || item.type == "BitmapText") {
			if (typeof item.fontSize === "number")
				item.fontSize = `${item.fontSize}px`
		}

		//console.log(container)
		cocainer.list.push(item)

    }

}

class GameObject {

    constructor(id, type, x, y, texture, frame, label) {
        this.type = type,
        this.id = id,
        this.components = new Array(),
        this.label = label

            switch (type) {
            case "BitmapText":
            case "Text":
                this.fontFamily = texture
                    this.text = frame
                    break
			default:
				this.texture = {
					key: texture,
					frame
				}
                break
            }
            // this.scope = "METHOD",
        this.x = x,
        this.y = y
    }

    scaleX(size) {
        this.scaleX = size
    }

    scaleY(size) {
        this.scaleY = size
    }

    setOrigin(x, y) {
        this.originX = x,
        this.originY = y
    }

    setStyle(style) {
        Object.assign(this, style);
    }

}
class Prefab {
	
	constructor () {
		this.add = this
		this.imageCount = 0
		this.containerCount = 0
		this.textCount = 0
		this.spriteCount = 0
	}


    image(x, y, texture, frame) {
		
		this.imageCount++
        let id = uuidv4();
        let image_instance = new GameObject(id, "Image", x, y, texture, frame, `Image_${this.imageCount}`)
		// this.image_temp_list.unshift(image_instance)
		return image_instance
    }

    sprite(x, y, texture, frame) {
		this.spriteCount++
        let id = uuidv4();
        let image_instance = new GameObject(id, "Sprite", x, y, texture, frame, `Sprite_${this.spriteCount}`)
		return image_instance
    }

    bitmapText(x, y, texture, frame) {
		this.textCount++
        let id = uuidv4();

        let image_instance = new GameObject(id, "BitmapText", x, y, texture, frame, `Text_${this.textCount}`)
            return image_instance
    }

    text(x, y, texture, frame) {
		this.textCount++
        let id = uuidv4();

        let image_instance = new GameObject(id, "BitmapText", x, y, texture, frame, `Text_${this.textCount}`)
            return image_instance
    }

    container(x, y) {
		this.containerCount++
        let id = uuidv4();
        let container = {
            type: "Container",
            id: id,
            label: `Container_${this.containerCount}`,
            x,
            y,
            list: [],
            components: []
        }

        //console.log(this)
        // if (!this.output) this.init()

        // this.displayList.unshift(container)

        return new Container(this, id, container)
    }
	
	// containerAdd
	
}


class Container {

    constructor(decompiler, id, container) {
        this.decompiler = decompiler
		this.id = id
		this.type = "Container"
		this.instance = container
    }

    add(instance) {
        this.decompiler.containerAdd(this, instance)
    }

}

class ContainerDecompiler {

    constructor(prefab) {
		console.log(prefab)
		this.prefab = prefab
		this.list = [];
		let id = uuidv4();
        let container = {
            type: "Container",
			id,
            label: process.argv[3],
            x:0,
            y:0,
            list: [],
            components: []
        }
        this.output = {}
        this.output.id = uuidv4(),
        this.output.sceneType = "PREFAB",
        this.output.settings = {
            "sceneKey": process.argv[3],
            "preloadMethodName": "",
            "preloadPackFiles": [],
            "createMethodName": "_create",
            "borderWidth": 1520,
            "borderHeight": 960
        },
        this.output.displayList = []
        this.output.meta = {
            "app": "Phaser Editor 2D - Scene Editor",
            "url": "https://phasereditor2d.com",
            "contentType": "phasereditor2d.core.scene.SceneContentType"
        }
		
		this.output.displayList.push(container)
		prefab.containerAdd = (container, instance) => this.add(instance)
		this._init = ContainerDecompiler.prototype._init
    }
	
	_init() {
		let output = new Object();
		for (const [key, val] of Object.entries(this)) {
			console.log(val.constructor.name)
			if(val.constructor.name == 'GameObject') {
				val.label = key;
				val.scope = "CLASS";
			}
			// use key and val
		}
		
		delete this.prefab.add
		fs.writeFileSync(`./out/${process.argv[3]}.scene`, JSON.stringify(this.output, null, 4))
	}

    add(instance) {
		this.output.displayList[0].list.unshift(instance)
    }
	
}


Phaser.GameObjects.Container = ContainerDecompiler;


fs.readFile(process.argv[2], 'UTF-8', (err, data) => {
	if(process.argv[4] == 'prefab') {
		eval(data + ` new ${process.argv[3]}(new Prefab())`)
	} else {
		eval(data + ` new ${process.argv[3]}`)
	}
})