'use client'
import { NextUIProvider } from '@nextui-org/react';

export default function Provider({ children }:  any) {
  return <NextUIProvider>{ children }</NextUIProvider>
}
