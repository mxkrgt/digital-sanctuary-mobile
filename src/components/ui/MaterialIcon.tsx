import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

type Props = {
  name: string;
  size?: number;
  color?: string;
};

export function MaterialIcon({ name, size = 24, color = '#13304f' }: Props) {
  return (
    <MaterialIcons
      name={name as React.ComponentProps<typeof MaterialIcons>['name']}
      size={size}
      color={color}
    />
  );
}
