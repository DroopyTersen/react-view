import * as React from 'react';
export declare const ActionButton: React.FC<{
    onClick: () => void;
    children: React.ReactNode;
    style?: React.CSSProperties;
    ['data-testid']?: string;
}>;
export declare const ActionButtons: React.FC<{
    formatCode: () => void;
    copyCode: () => void;
    copyUrl: () => void;
    reset: () => void;
}>;
