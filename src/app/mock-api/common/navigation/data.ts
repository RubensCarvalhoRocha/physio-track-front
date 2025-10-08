/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example',
    },
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'pessoa',
        title: 'Pacientes',
        type: 'basic',
        icon: 'heroicons_outline:users',
        link: '/pessoa',
    },
    {
        id: 'atendimento',
        title: 'Atendimentos',
        type: 'basic',
        icon: 'heroicons_outline:clipboard',
        link: '/atendimento',
        hidden: (item) => true
    },
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example',
    },
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example',
    },
];
