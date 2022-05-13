import React, { PureComponent } from 'react'
import Script from 'next/script'
import {
    ArcRotateCamera,
    MeshBuilder,
    Scene,
    Engine,
    HemisphericLight,
    StandardMaterial,
    Texture,
    Vector3,
} from '../babylon'

type EngineType = Engine & {
    renderLoop: () => void
}

/**
 * Babylon 3D Scene View
 */
export default class SceneView extends PureComponent {
    private canvas: HTMLCanvasElement | undefined
    id = 'Babylon'

    componentDidMount() {
        if (this.canvas) this.setup(this.canvas)
    }

    setup = (canvas: HTMLCanvasElement) => {
        const engine = this.createEngine(canvas) as EngineType
        const scene = new Scene(engine)
        const camera = new ArcRotateCamera(
            'Camera',
            -Math.PI / 3,
            Math.PI / 3,
            10,
            Vector3.Zero(),
            scene
        )
        camera.attachControl()
        camera.radius = 3
        const light = new HemisphericLight(
            'Light',
            new Vector3(0.33, 1, -0.67),
            scene
        )
        light.intensity = 0.9
        const texture = new Texture(`/images/grid.png`, scene)
        const mat = new StandardMaterial('Material', scene)
        mat.diffuseTexture = texture
        const box = MeshBuilder.CreateBox('box', { size: 1 }, scene)
        box.material = mat
        engine.runRenderLoop(engine.renderLoop)
    }

    createEngine = (canvas: HTMLCanvasElement) => {
        const engine = new Engine(canvas) as EngineType
        engine.renderLoop = () =>
            engine.scenes.forEach(scene => {
                if (scene.activeCamera) scene.render()
            })
        return engine
    }

    onMount = (canvas: HTMLCanvasElement) => (this.canvas = canvas)

    render() {
        // noinspection HtmlUnknownAttribute,HtmlRequiredTitleElement,JSUnresolvedLibraryURL
        return (
            <>
                <Script src="https://code.jquery.com/pep/0.4.3/pep.min.js" />
                <canvas id={this.id} ref={this.onMount} style={style} />
            </>
        )
    }
}

const style = { width: '100vw', height: '100vh' }
