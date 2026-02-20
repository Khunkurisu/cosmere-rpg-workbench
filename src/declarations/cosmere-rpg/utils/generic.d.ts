interface TargetDescriptor {
    /**
     * The UUID of the target.
     */
    uuid: string;

    /**
     * The target's name.
     */
    name: string;

    /**
     * The target's image.
     */
    img: string;

    /**
     * The target's defense values.
     */
    def: {
        phy: number;
        cog: number;
        spi: number;
    };
}