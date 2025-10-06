'use client';

import React from 'react';
import { IconType } from 'react-icons';
import styles from './SocialButton.module.css';

interface Props {
  icon: IconType;
  color: string;
  onClick?: () => void | Promise<void>;
  ariaLabel: string;
}

export default function SocialButton({ icon: Icon, color, onClick, ariaLabel }: Props) {
  return (
    <button
      type="button"
      className={styles.socialBtn}
      style={{ backgroundColor: color }}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <Icon className={styles.icon} />
    </button>
  );
}
