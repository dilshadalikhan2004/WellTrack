declare module 'ogl' {
    export class Renderer {
        constructor(options?: { dpr?: number; alpha?: boolean; antialias?: boolean;[key: string]: any });
        gl: WebGLRenderingContext | WebGL2RenderingContext;
        setSize(width: number, height: number): void;
        render(options: { scene: any; camera?: any }): void;
        dpr: number;
        destroy(): void;
    }
    export class Program {
        constructor(gl: any, options: { vertex: string; fragment: string; uniforms?: any;[key: string]: any });
        remove(): void;
    }
    export class Mesh {
        constructor(gl: any, options: { geometry: any; program: any;[key: string]: any });
        remove(): void;
    }
    export class Triangle {
        constructor(gl: any);
        remove(): void;
    }
    // Add other necessary exports as needed, or use 'any' if lazy
}
