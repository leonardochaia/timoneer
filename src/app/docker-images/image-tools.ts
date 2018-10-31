
export function explodeImage(image: string) {

  if (image.startsWith('sha256:')) {
    return {
      registry: null,
      reference: image.replace('sha256:', ''),
      tag: 'latest',
      isDefaultTag: true
    };
  }

  const matches = image.match(/(.+\/)?([^:]+)(:.+)?/);

  const registryOrNamespace = matches[1];
  let registry: string;
  let reference = matches[2];
  let tag = matches[3];

  if (registryOrNamespace) {

    if (registryOrNamespace.includes('/')) {
      // Registry and namespace
      const split = registryOrNamespace.split('/');
      registry = split[0];
      reference = `${split[1]}/${reference}`;
    } else if (registryOrNamespace.includes('.')) {
      // Registry only
      registry = registryOrNamespace;
    } else {
      // Namespace only
      reference = `${registryOrNamespace}/${reference}`;
    }
  }

  if (tag) {
    tag = tag.replace(':', '');
  } else {
    tag = 'latest';
  }

  return {
    registry,
    reference,
    tag,
    isDefaultTag: tag === 'latest'
  };
}

export function buildImageString(info: { registry: string, reference: string, tag: string }) {
  let base = '';
  if (info.registry) {
    base += `${info.registry}/`;
  }
  return base + `${info.reference}:${info.tag}`;
}

export function isValidImageName(image: string) {
  return !image.includes('<none>:<none>');
}
