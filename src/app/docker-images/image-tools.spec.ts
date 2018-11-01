import { explodeImage } from './image-tools';

describe('Image Tools', () => {
    it('should explode images without namespace or registry', () => {

        const image = 'nginx';

        const info = explodeImage(image);
        expect(info.registry).toBeUndefined();
        expect(info.reference).toBe('nginx');
        expect(info.isDefaultTag).toBeTruthy();
        expect(info.tag).toBe('latest');
    });

    it('should explode images with namespace', () => {

        const image = 'somenamespace/nginx';

        const info = explodeImage(image);
        expect(info.registry).toBeUndefined();
        expect(info.reference).toBe('somenamespace/nginx');
        expect(info.isDefaultTag).toBeTruthy();
        expect(info.tag).toBe('latest');
    });

    it('should explode images with namespace and registry', () => {

        const image = 'registry.com/somenamespace/nginx';

        const info = explodeImage(image);
        expect(info.registry).toBe('registry.com');
        expect(info.reference).toBe('somenamespace/nginx');
        expect(info.isDefaultTag).toBeTruthy();
        expect(info.tag).toBe('latest');
    });

    it('should explode images with registry', () => {

        const image = 'registry.com/nginx';

        const info = explodeImage(image);
        expect(info.registry).toBe('registry.com');
        expect(info.reference).toBe('nginx');
        expect(info.isDefaultTag).toBeTruthy();
        expect(info.tag).toBe('latest');
    });

    it('should explode images with registry, namespace and tag', () => {

        const image = 'registry.com/somenamespace/nginx:alpine';

        const info = explodeImage(image);
        expect(info.registry).toBe('registry.com');
        expect(info.reference).toBe('somenamespace/nginx');
        expect(info.isDefaultTag).toBeFalsy();
        expect(info.tag).toBe('alpine');
    });

    it('should explode images with namespace and tag', () => {

        const image = 'somenamespace/nginx:alpine';

        const info = explodeImage(image);
        expect(info.registry).toBeUndefined();
        expect(info.reference).toBe('somenamespace/nginx');
        expect(info.isDefaultTag).toBeFalsy();
        expect(info.tag).toBe('alpine');
    });

    it('should explode images with tag', () => {

        const image = 'nginx:alpine';

        const info = explodeImage(image);
        expect(info.registry).toBeUndefined();
        expect(info.reference).toBe('nginx');
        expect(info.isDefaultTag).toBeFalsy();
        expect(info.tag).toBe('alpine');
    });
});
