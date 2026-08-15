import { useEffect, useState } from 'react';
import { SvgXml } from 'react-native-svg';

import { FlagPlaceholder } from '@/components/flag-placeholder';

type CountryFlagProps = {
  uri: string;
  width: number;
  height: number;
  accessibilityLabel?: string;
};

/**
 * Las banderas SVG de restcountries.com no traen `viewBox` en el <svg> raíz.
 * Sin viewBox, SvgUri no sabe cómo escalar el contenido a un width/height
 * distinto del original y termina recortándolo en vez de escalarlo. Traemos
 * el XML nosotros y le inyectamos un viewBox derivado de su propio
 * width/height antes de renderizarlo con SvgXml.
 */
function ensureViewBox(xml: string): string {
  const svgTagMatch = xml.match(/<svg[^>]*>/i);
  if (!svgTagMatch) {
    return xml;
  }

  const svgTag = svgTagMatch[0];
  if (/viewBox=/i.test(svgTag)) {
    return xml;
  }

  const widthMatch = svgTag.match(/width="([\d.]+)"/i);
  const heightMatch = svgTag.match(/height="([\d.]+)"/i);
  if (!widthMatch || !heightMatch) {
    return xml;
  }

  const patchedTag = svgTag.replace(/<svg/i, `<svg viewBox="0 0 ${widthMatch[1]} ${heightMatch[1]}"`);
  return xml.replace(svgTag, patchedTag);
}

export function CountryFlag({ uri, width, height, accessibilityLabel }: CountryFlagProps) {
  const [xml, setXml] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!uri) {
      setHasError(true);
      return;
    }

    let cancelled = false;
    setXml(null);
    setHasError(false);

    fetch(uri)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch flag: ${response.status}`);
        }
        return response.text();
      })
      .then((text) => {
        if (!cancelled) {
          setXml(ensureViewBox(text));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setHasError(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [uri]);

  if (hasError || !xml) {
    return <FlagPlaceholder width={width} height={height} />;
  }

  return <SvgXml xml={xml} width={width} height={height} accessibilityLabel={accessibilityLabel} />;
}
