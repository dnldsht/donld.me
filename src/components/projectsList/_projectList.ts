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
    projectName: '@we/dt',
    description: 'Powerful and flexible data table for Vue.js',
    previewLink: 'https://nuxt.weconstudio.it/datatable',
    repo: {
      link: 'https://git.weconstudio.it/we/dt',
      host: 'gitlab',
    },
  },
]
