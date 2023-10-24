import Phaser from "phaser";
import { sharedInstance as events } from "./EventCenter";

export default class UI extends Phaser.Scene {

    private starsLabel!: Phaser.GameObjects.Text
    private starsCollected = 0
    private graphics!: Phaser.GameObjects.Graphics

    private lastHealth = 100

    constructor() {
        super({
            key: 'ui'
        })
    }
    init() {
        this.starsCollected = 0
    }

    create() {

        // Barra de vida
        this.graphics = this.add.graphics()
        this.setHealthBar(100)


        // Texto con contador de estrellas
        this.starsLabel = this.add.text(10, 35, 'Stars: 0', {
            fontSize: '32px'
        })

        // Aumentar collectible
        events.on('star-collected', this.handleStarCollected, this)

        events.on('health-changed', this.handleHealthChanged, this)

        // Si se cambia la pantalla (no actualizar la pagina), con esta linea 
        // se re-setean los eventos para que apliquen una sola vez
        this.events.once(Phaser.Scenes.Events.DESTROY, () => {
            events.off('star-collected', this.handleStarCollected, this)
        })
    }

    private setHealthBar(value: number) {
        // Ancho del hp bar para el render
        const width = 200
        // Porcentaje de vida actual
        const percent = Phaser.Math.Clamp(value, 0, 100) / 100

        this.graphics.clear()
        this.graphics.fillStyle(0x808080)
        this.graphics.fillRoundedRect(10, 10, width, 20, 5)

        // Si el porcentaje es 0, no se hace render de hp
        if (percent > 0) {
            this.graphics.fillStyle(0x00ff00)
            this.graphics.fillRoundedRect(10, 10, width * percent, 20, 5)
        }

    }

    private handleHealthChanged(value: number) {
        this.tweens.addCounter({
            from: this.lastHealth,
            to: value,
            duration: 200,
            ease: Phaser.Math.Easing.Sine.InOut,
            onUpdate: tween => {
                const value = tween.getValue()
                this.setHealthBar(value)
            }
        })
        this.lastHealth = value
    }

    private handleStarCollected() {
        ++this.starsCollected
        this.starsLabel.text = `Stars: ${this.starsCollected}`
    }

}



