interface AvatarProps {
  src: string;
  alt: string;
}

export const Avatar = ({ src, alt }: AvatarProps) => (
  <img src={src} alt={alt} className="w-10 h-10 rounded-full border" />
);
