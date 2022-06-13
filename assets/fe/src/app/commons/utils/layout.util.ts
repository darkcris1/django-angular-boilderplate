import { HeaderComponent } from 'src/app/components/global/header/header.component';

export const ContentOnly = (content: any) => {
  return { content };
}

export const HeadContent = (content: any) => {
  return {
    header: HeaderComponent,
    content
  }
}