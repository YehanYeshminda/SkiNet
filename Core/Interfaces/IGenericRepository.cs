using Core.Entities;

namespace Core.Interfaces
{
    // this is only usable by the classes which are deriving from the base entity
    public interface IGenericRepository<T> where  T : BaseEntity
    {
        Task<T> GetByIdAsync(int id);
        Task<IReadOnlyList<T>> ListAllAsync();
    }
}