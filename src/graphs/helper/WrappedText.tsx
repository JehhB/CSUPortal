import useLayout from "@/shared/hooks/useLayout";
import { useState } from "react";
import { Platform } from "react-native";
import { TSpan, Text, TextProps } from "react-native-svg";

export type WrappedTextProps = Omit<
  TextProps,
  "children" | "x" | "y" | "inlineSize" | "fill" | "fontSize"
> & {
  x?: number;
  y?: number;
  inlineSize?: number;
  children?: string;
  fill?: string;
  fontSize?: number;
};

function WrappedTextWeb(props: WrappedTextProps) {
  const [height, setHeight] = useState(0);

  const layoutRef = useLayout<HTMLParagraphElement>((e) => {
    setHeight(e.nativeEvent.layout.height);
  });

  return (
    <foreignObject
      x={props.x}
      y={props.y}
      height={height}
      width={props.inlineSize}
    >
      <p
        ref={layoutRef}
        style={{
          margin: 0,
          fontFamily: props.fontFamily,
          fontWeight: props.fontWeight,
          fontSize: props.fontSize,
          lineHeight: 1.15,
          color: props.fill,
        }}
      >
        {props.children}
      </p>
    </foreignObject>
  );
}

function WrappedTextNative(props: WrappedTextProps) {
  const { inlineSize, children, ...textProps } = props;
  return (
    <Text transform={[{ translateY: props.fontSize ?? 16 }]} {...textProps}>
      <TSpan inlineSize={inlineSize}>{children}</TSpan>
    </Text>
  );
}

export default function WrappedText(props: WrappedTextProps) {
  return Platform.OS === "web" ? (
    <WrappedTextWeb {...props} />
  ) : (
    <WrappedTextNative {...props} />
  );
}
