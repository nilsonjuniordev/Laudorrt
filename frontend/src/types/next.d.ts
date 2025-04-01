/// <reference types="next" />
/// <reference types="next/types/global" />
/// <reference types="next/image-types/global" />

declare module 'next/router' {
  import { NextRouter } from 'next/router';
  export { NextRouter };
  export function useRouter(): NextRouter;
}

declare module 'next/server' {
  import { NextResponse, NextRequest } from 'next/server';
  export { NextResponse, NextRequest };
}
