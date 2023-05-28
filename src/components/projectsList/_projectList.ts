export interface Project {
  projectName: string
  description: string
  repo?: {
    link: string
    host: 'github' | 'gitlab'
  }
  previewLink: string
}

type Projects<T> = T[]

export const projects: Projects<Project> = [
  {
    projectName: '@we/nuxt',
    description: 'A collection of useful modules for Nuxt',
    previewLink: 'https://nuxt.weconstudio.it/',
    repo: {
      link: 'https://git.weconstudio.it/we/nuxt',
      host: 'gitlab',
    },
  },
  {
    projectName: 'Qipo',
    description: 'Smart system for the management of the company',
    previewLink: 'https://qipo.it',
  },
  {
    projectName: 'vue-insta-stories',
    description: 'Instagram stories component for Vue 2/3',
    previewLink: 'https://vue-insta-stories.donld.me',
    repo: {
      link: 'https://github.com/dnldsht/vue-insta-stories',
      host: 'github',
    },
  },
  {
    projectName: 'master-thesis',
    description: 'Incomplete time-series classification methods',
    previewLink: 'https://github.com/dnldsht/master-thesis',
  },
  {
    projectName: '@we/dt',
    description: 'Powerful and flexible data table for Vue.js',
    previewLink: 'https://nuxt.weconstudio.it/datatable',
    repo: {
      link: 'https://git.weconstudio.it/we/dt',
      host: 'gitlab',
    },
  },
  {
    projectName: 'mobile-preview',
    description: 'Preview any website on popular mobile devices',
    previewLink: 'https://mobile.donld.me',
    repo: {
      link: 'https://github.com/dnldsht/mobile-preview',
      host: 'github',
    },
  },
  {
    projectName: 'Leafpic',
    description: 'Material designed Android gallery app',
    previewLink: 'https://github.com/UnevenSoftware/LeafPic',
  },
]
