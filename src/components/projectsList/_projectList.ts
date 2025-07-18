const icons = {
  link: 'i-ph-link',
  gitlab: 'i-ph-gitlab-logo',
  github: 'i-ph-github-logo',
}

type ValueOf<T> = T[keyof T]

export interface Link {
  href: string
  icon: ValueOf<typeof icons>
  label: string
}

export interface Project {
  projectName: string
  description: string
  period?: string
  links: Link[]
}

export function previewLink(project: Project) {
  let link = project.links.find(link => link.icon === icons.link)
  if (!link)
    link = project.links[0]

  return link.href
}

export const projects: Project[] = [
  {
    projectName: 'Qipo',
    description: 'Smart system for the management of the company',
    period: '2021 - now',
    links: [
      {
        href: 'https://qipo.it',
        icon: icons.link,
        label: 'Project website',
      },
    ],
  },
  {
    projectName: '@we/nuxt',
    description: 'A collection of useful modules for Nuxt',
    period: '2020 - now',
    links: [
      {
        href: 'https://git.weconstudio.it/we/nuxt',
        icon: icons.gitlab,
        label: 'GitLab repository',
      },
      {
        href: 'https://nuxt.weconstudio.it/',
        icon: icons.link,
        label: 'Project website',
      },
    ],
  },
  {
    projectName: 'kindle-digest',
    description: 'Kindle Digest is a tool that allows you to read Hacker News and newsletters on your Kindle',
    period: '2024',
    links: [
      {
        href: 'https://github.com/dnldsht/kindle-digest',
        icon: icons.github,
        label: 'GitHub repository',
      },
    ],
  },
  {
    projectName: '@we/dt',
    description: 'Powerful and flexible data table for Vue.js',
    period: '2021 - now',
    links: [
      {
        href: 'https://git.weconstudio.it/we/dt',
        icon: icons.gitlab,
        label: 'GitLab repository',
      },
      {
        href: 'https://nuxt.weconstudio.it/components/we-data-table',
        icon: icons.link,
        label: 'Project website',
      },
    ],
  },
  {
    projectName: 'Doctorapp',
    description: 'Suite of applications designed to  optimize organization within your medical practice',
    period: '2021 - now',
    links: [
      {
        href: 'https://pro.doctorapp.it/',
        icon: icons.link,
        label: 'Project website',
      },
    ],
  },
  {
    projectName: 'nuxt-luxon',
    description: 'Vue/Nuxt library that simplifies date time formatting and parsing using Luxon',
    period: '2025',
    links: [
      {
        href: 'https://github.com/dnldsht/nuxt-luxon',
        icon: icons.github,
        label: 'GitHub repository',
      },
      {
        href: 'https://nuxt-luxon.donld.me',
        icon: icons.link,
        label: 'Project website',
      },
    ],
  },
  {
    projectName: 'master-thesis',
    description: 'Incomplete time-series classification methods',
    period: '2023',
    links: [
      {
        href: 'https://github.com/dnldsht/master-thesis',
        icon: icons.github,
        label: 'GitHub repository',
      },
    ],
  },
  {
    projectName: 'mobile-preview',
    description: 'Preview any website on popular mobile devices',
    period: '2023',
    links: [
      {
        href: 'https://github.com/dnldsht/mobile-preview',
        icon: icons.github,
        label: 'GitHub repository',
      },
      {
        href: 'https://mobile.donld.me',
        icon: icons.link,
        label: 'Project website',
      },
    ],
  },
  {
    projectName: 'vue-insta-stories',
    description: 'Instagram stories component for Vue 2/3',
    period: '2021',
    links: [
      {
        href: 'https://github.com/dnldsht/vue-insta-stories',
        icon: icons.github,
        label: 'GitHub repository',
      },
      {
        href: 'https://vue-insta-stories.donld.me',
        icon: icons.link,
        label: 'Project website',
      },
    ],
  },
  {
    projectName: 'Leafpic',
    description: 'Material designed Android gallery app',
    period: '2016 - 2018',
    links: [
      {
        href: 'https://github.com/UnevenSoftware/LeafPic',
        icon: icons.github,
        label: 'GitHub repository',
      },
    ],
  },
]
