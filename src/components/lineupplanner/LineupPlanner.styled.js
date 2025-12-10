import styled from 'styled-components'

export const PlannerWrapper = styled.div`
    display: grid;
    grid-template-columns: minmax(260px, 320px) 1fr;
    gap: 1.5rem;
    width: 100%;
    align-items: flex-start;

    @media (max-width: ${({ theme }) => theme.medium}) {
        grid-template-columns: 1fr;
    }
`

export const Controls = styled.section`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: ${({ theme }) => theme.primaryLight};
    color: ${({ theme }) => theme.primaryDark};
    padding: 1.25rem;
    border-radius: 1rem;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.15);
    position: sticky;
    top: 1rem;

    @media (max-width: ${({ theme }) => theme.medium}) {
        position: static;
    }
`

export const SectionTitle = styled.h2`
    font-size: 1.3rem;
    margin: 0;
`

export const ControlGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`

export const Label = styled.label`
    font-weight: 600;
`

export const Select = styled.select`
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    border: 1px solid ${({ theme }) => theme.grey};
    background: ${({ theme }) => theme.primaryLight};
    color: ${({ theme }) => theme.primaryDark};
    font-size: 1rem;
`

export const FormationOptions = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
`

export const FormationOption = styled.label`
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.35rem 0.7rem;
    border-radius: 999px;
    background: ${({ theme, $active }) => $active ? theme.blue : 'transparent'};
    color: ${({ theme, $active }) => $active ? theme.primaryLight : theme.primaryDark};
    border: 1px solid ${({ theme }) => theme.blue};
    font-size: 0.95rem;
    cursor: pointer;
    transition: background 0.2s ease;

    input {
        display: none;
    }
`

export const CustomColumnsInput = styled.input`
    width: 5rem;
    padding: 0.4rem 0.5rem;
    border-radius: 0.5rem;
    border: 1px solid ${({ theme }) => theme.grey};
    font-size: 0.95rem;
`

export const FormationControls = styled.div`
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
`

export const SmallButton = styled.button`
    padding: 0.4rem 0.75rem;
    border-radius: 0.5rem;
    border: none;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 600;
    background: ${({ theme }) => theme.blue};
    color: ${({ theme }) => theme.primaryLight};
    transition: background 0.2s ease;

    &:hover {
        background: ${({ theme }) => theme.primaryHover};
    }

    &:disabled {
        background: ${({ theme }) => theme.grey};
        cursor: not-allowed;
    }
`

export const Pool = styled.section`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem;
    border-radius: 1rem;
    border: 2px dashed ${({ theme }) => theme.grey};
    min-height: 12rem;
    background: rgba(255, 255, 255, 0.6);
`

export const PoolHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 0.5rem;

    h3 {
        margin: 0;
        font-size: 1.1rem;
    }

    span {
        font-size: 0.9rem;
        color: ${({ theme }) => theme.grey};
    }
`

export const PoolColumns = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 0.75rem;
`

export const PoolColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`

export const PoolColumnTitle = styled.h4`
    margin: 0;
    font-size: 0.95rem;
    color: ${({ theme }) => theme.grey};
    text-transform: uppercase;
    letter-spacing: 0.08em;
`

export const PoolEmptyText = styled.p`
    margin: 0;
    font-size: 0.9rem;
    color: ${({ theme }) => theme.grey};
`

export const Canvas = styled.section`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`

export const CanvasHeader = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    h3 {
        margin: 0;
        font-size: 1.25rem;
    }

    span {
        color: ${({ theme }) => theme.grey};
        font-size: 0.95rem;
    }
`

export const LineupArea = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: ${({ theme }) => theme.primaryLight};
    border-radius: 1rem;
    padding: 1.25rem;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.1);
`

export const LineupRow = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`

export const RowLabel = styled.div`
    font-weight: 600;
    color: ${({ theme }) => theme.grey};
    display: flex;
    align-items: center;
    gap: 0.5rem;
`

export const RowGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(${({ $columns }) => $columns}, minmax(110px, 1fr));
    gap: 0.75rem;

    @media (max-width: ${({ theme }) => theme.mobile}) {
        grid-template-columns: repeat(${({ $columns }) => Math.min($columns, 2)}, minmax(110px, 1fr));
    }
`

export const ConductorRowGrid = styled.div`
    display: flex;
    justify-content: center;
`

export const Slot = styled.div`
    min-height: 4.25rem;
    border: 2px dashed ${({ theme }) => theme.grey};
    border-radius: 0.75rem;
    padding: 0.35rem;
    display: flex;
    align-items: stretch;
    justify-content: center;
    background: rgba(255, 255, 255, 0.75);
    transition: border-color 0.2s ease, background 0.2s ease;

    &[data-active='true'] {
        border-color: ${({ theme }) => theme.blue};
        background: rgba(109, 211, 206, 0.15);
    }
`

export const ConductorSlot = styled(Slot)`
    flex: 0 1 170px;
    width: 100%;
`

export const Placeholder = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.grey};
    font-size: 0.85rem;
    width: 100%;
`

export const PersonCard = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    background: ${({ theme }) => theme.primaryLight};
    color: ${({ theme }) => theme.primaryDark};
    border-radius: 0.7rem;
    padding: 0.5rem 0.75rem;
    border: 1px solid ${({ theme }) => theme.grey};
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    cursor: grab;
    user-select: none;
    border-left: 5px solid ${({ theme, $status }) => {
        switch($status){
        case 'confirmed':
            return theme.green;
        case 'probable':
            return theme.blue;
        case 'probableAbsent':
            return theme.red;
        case 'maybe':
            return theme.orange;
        default:
            return theme.grey;
        }
    }};

    &:active {
        cursor: grabbing;
    }
`

export const PersonName = styled.span`
    font-weight: 600;
    font-size: 1rem;
`

export const PersonMeta = styled.span`
    font-size: 0.85rem;
    color: ${({ theme }) => theme.grey};
`

export const StatusTag = styled.span`
    align-self: flex-start;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.15rem 0.5rem;
    border-radius: 999px;
    background: ${({ theme, $status }) => {
        switch($status){
        case 'confirmed':
            return `${'rgba(0, 189, 0, 0.2)'}`;
        case 'probable':
            return `${'rgba(109, 211, 206, 0.25)'}`;
        case 'probableAbsent':
            return `${'rgba(235, 87, 87, 0.25)'}`;
        case 'maybe':
            return `${'rgba(250, 169, 22, 0.25)'}`;
        default:
            return `${'rgba(116, 131, 134, 0.2)'}`;
        }
    }};
    color: ${({ theme, $status }) => {
        switch($status){
        case 'confirmed':
            return theme.green;
        case 'probable':
            return theme.blue;
        case 'probableAbsent':
            return theme.red;
        case 'maybe':
            return theme.orange;
        default:
            return theme.grey;
        }
    }};
`

export const HelperText = styled.p`
    margin: 0;
    font-size: 0.85rem;
    color: ${({ theme }) => theme.grey};
`

export const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    align-items: flex-start;
    background: ${({ theme }) => theme.primaryLight};
    border-radius: 1rem;
    padding: 1.25rem;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.1);
`

export const LoadingState = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1rem;
    color: ${({ theme }) => theme.grey};
`

