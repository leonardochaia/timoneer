
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

  let registryOrNamespace = matches[1];
  let registry: string;
  let reference = matches[2];
  let tag = matches[3];

  if (registryOrNamespace) {
    registryOrNamespace = registryOrNamespace.replace('/', '');

    // Determine registry vs namespace
    if (registryOrNamespace.includes('.')) {
      registry = registryOrNamespace;
    } else {
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